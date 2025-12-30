// Helper functions to get leader images from Cloudinary with local fallbacks
import { getCloudinaryImageUrl } from './cloudinary-client';
import type { CloudinaryGalleryImage } from './cloudinary-client';

// Cloudinary Public ID mappings for each leader (now organized in tpwbm/leaders folder)
export const cloudinaryLeaderImages: { [key: string]: string } = {
  // Pastors - IMPORTANT NAMING: Pastor Tunde Olufemi (individual) vs Pastor Tunde & Esther Olufemi (both)
  'Pastor Tunde Olufemi': 'pastor-image-1_qvub82', // Use existing pastor page image as fallback
  'Pastor Esther Olufemi': 'tpwbm/leaders/Pastor_Esther_Olufemi_djhunp',
  'Pastor Tunde & Esther Olufemi': 'tpwbm/leaders/Pastor_Tunde_Esther_Olufemi_xwc6z0', // Both pastor and wife

  // Deacons and Deaconesses
  'Dn. Lawrence S. Komolafe': 'tpwbm/leaders/Dn._Lawrence_S._Komolafe_iiqikz',
  'Dn Sam Sofowora': 'tpwbm/leaders/Dn._Samuel_Sofowora_hjfjfh',
  'Dn. Sam. O Sofowora': 'tpwbm/leaders/Dn._Samuel_Sofowora_hjfjfh',
  // 'Dn. (Dr) Ope Olumade': 'tpwbm/leaders/Dn._Ope_Olumade_new', // Commented out to use local image
  'Dns. Titilayo A. Bankole': 'tpwbm/leaders/Dns._Titilayo_A._Bankole_cukccm',
  'Dns. T.A Bankole': 'tpwbm/leaders/Dns._Titilayo_A._Bankole_cukccm',

  // Evangelists
  'Evang. Abiodun Nosiru': 'tpwbm/leaders/Evang._Abiodun_Nosiru_ksvkhx',
  'Evang. Eunice F. Olofin': 'tpwbm/leaders/Evang_Eunice_F._Olofin_jpmah2',
  'Evang Eunice F. Olufemi': 'tpwbm/leaders/Evang_Eunice_F._Olofin_jpmah2', // Same person

  // Ministers
  'Minister Peace Olufemi': 'tpwbm/leaders/Minister_Peace_Olufemi_nallq1',

  // Brothers
  'Bro Praise Olufemi': 'tpwbm/leaders/Bro_Praise_Olufemi_ncgp5d',
  'Bro Precious Olufemi': 'tpwbm/leaders/Bro_Precious_Olufemi_tiripz',
  'Bro. Precious Olufemi': 'tpwbm/leaders/Bro_Precious_Olufemi_tiripz',
  'Bro Tunde Adebesin': 'tpwbm/leaders/Bro_Tunde_Adebesin_gyna0d',
  'Bro. David Jacob': 'tpwbm/leaders/Bro._David_Jacob_zsfruz',

  // Sisters/Mrs
  'Mrs Kehinde Komolafe': 'tpwbm/leaders/Mrs_Kehinde_Komolafe_btj4eg',
  // 'Mrs. Bola Komolafe': Use local image mapping instead
  'Mrs Toyin Obasi': 'tpwbm/leaders/Mrs_Toyin_Obasi_gjlbwk',
  'Mrs. Ruth M. Oluwole': 'tpwbm/leaders/Mrs._Ruth_M._Oluwole_nnad4w',
  'Mrs. Ruth Oluwole': 'tpwbm/leaders/Mrs._Ruth_M._Oluwole_nnad4w',
  'Mrs. Temitayo Adeosun': 'tpwbm/leaders/Mrs._Temitayo_Adeosun_k5dpwp',
};

// Function to get leader image from Cloudinary by direct mapping or name matching
export function getCloudinaryLeaderImage(leaderName: string, cloudinaryImages?: CloudinaryGalleryImage[]): string | null {
  // First check direct Cloudinary public ID mapping
  const directMapping = cloudinaryLeaderImages[leaderName];
  if (directMapping) {
    return getCloudinaryImageUrl(directMapping, {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto'
    });
  }

  // Try some variations for exact matches
  const variations = [
    leaderName.replace(/Mrs\. /g, 'Mrs '),
    leaderName.replace(/Mrs /g, 'Mrs. '),
    leaderName.replace(/Bro\. /g, 'Bro '),
    leaderName.replace(/Bro /g, 'Bro. '),
    leaderName.replace(/Dn\. /g, 'Dn '),
    leaderName.replace(/Evang\. /g, 'Evang '),
    leaderName.replace(/Evang /g, 'Evang. ')
  ];

  for (const variation of variations) {
    const mapping = cloudinaryLeaderImages[variation];
    if (mapping) {
      return getCloudinaryImageUrl(mapping, {
        width: 200,
        height: 200,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        format: 'auto'
      });
    }
  }

  // If cloudinaryImages array is provided, try the old matching logic as fallback
  if (cloudinaryImages && cloudinaryImages.length > 0) {
    // Clean the leader name for matching
    const cleanName = leaderName
        .replace(/\./g, '') // Remove periods
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase();

    // Try exact match first
    let matchingImage = cloudinaryImages.find(img => {
      const imgName = img.title.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '');
      return imgName.includes(cleanName) || cleanName.includes(imgName);
    });

    // If no exact match, try partial matching with last name
    if (!matchingImage) {
      const lastName = leaderName.split(' ').pop()?.toLowerCase();
      if (lastName) {
        matchingImage = cloudinaryImages.find(img =>
            img.title.toLowerCase().includes(lastName)
        );
      }
    }

    // If still no match, try first name
    if (!matchingImage) {
      const firstName = leaderName.split(' ')[1] || leaderName.split(' ')[0]; // Skip titles like "Pastor", "Mrs"
      if (firstName) {
        matchingImage = cloudinaryImages.find(img =>
            img.title.toLowerCase().includes(firstName.toLowerCase())
        );
      }
    }

    return matchingImage ? matchingImage.src : null;
  }

  return null;
}

export function getLeaderImagePath(leaderName: string): string | null {
  // Direct mapping of leader names to their exact local image file names (fallback)
  const leaderImageMap: { [key: string]: string } = {
    // Pastors
    'Pastor Tunde Olufemi': '/images/pastor/Pastor_Tunde_ Olufemi.jpeg', // Use existing pastor image
    'Pastor Esther Olufemi': '/images/leaders/Pastor Esther Olufemi.JPG',
    'Pastor Tunde & Esther Olufemi': '/images/leaders/Pastor Tunde & Esther Olufemi.jpeg',

    // Deacons and Deaconesses
    'Dn. Lawrence S. Komolafe': '/images/leaders/Dn. Lawrence S. Komolafe.jpeg',
    'Dn Sam Sofowora': '/images/leaders/Dn. Samuel Sofowora.jpeg',
    'Dn. Sam. O Sofowora': '/images/leaders/Dn. Samuel Sofowora.jpeg',
    'Dn. (Dr) Ope Olumade': '/images/leaders/Dn. (Dr) Ope Olumade.jpg',
    'Dns. Titilayo A. Bankole': '/images/leaders/Dns. Titilayo A. Bankole.jpeg',
    'Dns. T.A Bankole': '/images/leaders/Dns. Titilayo A. Bankole.jpeg',

    // Evangelists
    'Evang. Abiodun Nosiru': '/images/leaders/Evang. Abiodun Nosiru.jpeg',
    'Evang. Eunice F. Olofin': '/images/leaders/Evang Eunice F. Olofin.jpeg',
    'Evang Eunice F. Olufemi': '/images/leaders/Evang Eunice F. Olofin.jpeg',

    // Ministers
    'Minister Peace Olufemi': '/images/leaders/Minister Peace Olufemi.jpeg',

    // Brothers
    'Bro Praise Olufemi': '/images/leaders/Bro Praise Olufemi.jpeg',
    'Bro Precious Olufemi': '/images/leaders/Bro Precious Olufemi.jpeg',
    'Bro. Precious Olufemi': '/images/leaders/Bro Precious Olufemi.jpeg',
    'Bro Tunde Adebesin': '/images/leaders/Bro Tunde Adebesin.jpeg',
    'Bro. David Jacob': '/images/leaders/Bro. David Jacob.jpeg',

    // Sisters/Mrs
    'Mrs Kehinde Komolafe': '/images/leaders/Mrs Kehinde Komolafe.jpeg',
    'Mrs. Bola Komolafe': '/images/leaders/Mrs Bola Komolafe.jpg', // Added mapping for Mrs. Bola Komolafe
    'Mrs Toyin Obasi': '/images/leaders/Mrs Toyin Obasi.jpeg',
    'Mrs. Ruth M. Oluwole': '/images/leaders/Mrs. Ruth M. Oluwole.jpeg',
    'Mrs. Ruth Oluwole': '/images/leaders/Mrs. Ruth M. Oluwole.jpeg',
    'Mrs. Temitayo Adeosun': '/images/leaders/Mrs. Temitayo Adeosun.jpeg',
  };

  // First check direct mapping
  if (leaderImageMap[leaderName]) {
    return leaderImageMap[leaderName];
  }

  // Try some variations for partial matches
  const variations = [
    leaderName.replace(/Mrs\. /g, 'Mrs '),
    leaderName.replace(/Mrs /g, 'Mrs. '),
    leaderName.replace(/Bro\. /g, 'Bro '),
    leaderName.replace(/Bro /g, 'Bro. '),
    leaderName.replace(/Dn\. /g, 'Dn '),
    leaderName.replace(/Evang\. /g, 'Evang '),
    leaderName.replace(/Evang /g, 'Evang. ')
  ];

  for (const variation of variations) {
    if (leaderImageMap[variation]) {
      return leaderImageMap[variation];
    }
  }

  return null;
}

export function getFallbackImage(leaderName: string): string | null {
  // Return a default placeholder or null
  return null;
}
