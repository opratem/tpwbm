import { AdminLayout } from '@/components/admin/admin-layout';
import CloudinaryUpload from '@/components/admin/cloudinary-upload';

export default function AdminMediaPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
            <p className="mt-2 text-gray-600">
              Upload and manage church images using Cloudinary.
              Upload your tpwm folder images here to migrate from Google Drive.
            </p>
          </div>

          <CloudinaryUpload />

          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900">Setup Cloudinary:</h3>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Sign up for a free Cloudinary account at cloudinary.com</li>
                  <li>Get your Cloud Name, API Key, and API Secret from your dashboard</li>
                  <li>Update the .env.local file with your Cloudinary credentials</li>
                  <li>Create an upload preset in your Cloudinary settings (optional)</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Upload Guidelines:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Use descriptive folder names like "gallery", "leaders", "events", etc.</li>
                  <li>Add relevant tags to help organize and search images</li>
                  <li>Supported formats: JPG, PNG, GIF, WebP</li>
                  <li>Cloudinary will automatically optimize images for web delivery</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Folder Structure Recommendation:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>church_media/gallery</code> - General church photos</li>
                  <li><code>church_media/leaders</code> - Leadership team photos</li>
                  <li><code>church_media/events</code> - Event photos</li>
                  <li><code>church_media/ministries</code> - Ministry-specific photos</li>
                  <li><code>church_media/pastor</code> - Pastor photos</li>
                  <li><code>church_media/resources</code> - Resource images and books</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
