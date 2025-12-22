"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Filter,
  Heart
} from "lucide-react";

// Mock member data
const mockMembers = [
  {
    id: 1,
    name: "John Smith",
    initials: "JS",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street",
    memberSince: "2019-03-15",
    ministries: ["Worship", "Youth"],
    role: "member",
    birthday: "June 15",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    initials: "SJ",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    address: "456 Pine Avenue",
    memberSince: "2020-01-10",
    ministries: ["Children", "Prayer"],
    role: "member",
    birthday: "March 22",
    status: "active",
  },
  {
    id: 3,
    name: "Pastor Michael Davis",
    initials: "MD",
    email: "pastor@tpwbm.org",
    phone: "(555) 345-6789",
    address: "789 Church Lane",
    memberSince: "2015-08-01",
    ministries: ["Pastoral", "Teaching"],
    role: "admin",
    birthday: "August 8",
    status: "active",
  },
  {
    id: 4,
    name: "Emily Wilson",
    initials: "EW",
    email: "emily.w@email.com",
    phone: "(555) 456-7890",
    address: "321 Maple Drive",
    memberSince: "2021-05-20",
    ministries: ["Outreach", "Women"],
    role: "member",
    birthday: "November 3",
    status: "active",
  },
  {
    id: 5,
    name: "David Brown",
    initials: "DB",
    email: "david.brown@email.com",
    phone: "(555) 567-8901",
    address: "654 Elm Street",
    memberSince: "2018-12-03",
    ministries: ["Men", "Finance"],
    role: "member",
    birthday: "February 14",
    status: "active",
  },
  {
    id: 6,
    name: "Lisa Garcia",
    initials: "LG",
    email: "lisa.garcia@email.com",
    phone: "(555) 678-9012",
    address: "987 Birch Road",
    memberSince: "2022-01-15",
    ministries: ["Music", "Hospitality"],
    role: "member",
    birthday: "September 25",
    status: "active",
  },
];

export default function MemberDirectory() {
  const { data: session } = useSession();
  const [members] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  // Get unique ministries for filter
  const allMinistries = Array.from(
      new Set(members.flatMap(member => member.ministries))
  ).sort();

  // Filter members based on search and ministry
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinistry = selectedMinistry === "all" ||
        member.ministries.includes(selectedMinistry);
    return matchesSearch && matchesMinistry;
  });

  const getMembershipYears = (memberSince: string) => {
    const years = new Date().getFullYear() - new Date(memberSince).getFullYear();
    return years;
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

  if (!session) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        </div>
    );
  }

  return (
      <>
        {/* Breadcrumbs */}
        <Breadcrumbs />

        <div className="container max-w-6xl py-10 space-y-8">
          {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">Member Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Connect with fellow members of our church family
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Members</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <Label htmlFor="ministry">Filter by Ministry</Label>
                <select
                    id="ministry"
                    value={selectedMinistry}
                    onChange={(e) => setSelectedMinistry(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="all">All Ministries</option>
                  {allMinistries.map((ministry) => (
                      <option key={ministry} value={ministry}>
                        {ministry}
                      </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                >
                  Cards
                </Button>
                <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {filteredMembers.length} members found
            </span>
            </div>
          </CardContent>
        </Card>

        {/* Members Display */}
        {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-600">
                            {member.initials}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <Badge className={getRoleColor(member.role)}>
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Member for {getMembershipYears(member.memberSince)} years
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{member.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Birthday: {member.birthday}</span>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium text-gray-500">MINISTRIES</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.ministries.map((ministry, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ministry}
                              </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ministries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Years
                      </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                                  {member.initials}
                                </div>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{member.name}</span>
                                  <Badge className={getRoleColor(member.role)}>
                                    {member.role}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">Birthday: {member.birthday}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span>{member.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {member.ministries.map((ministry, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {ministry}
                                  </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getMembershipYears(member.memberSince)}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        )}

        {filteredMembers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
        )}
      </div>
    </>
  );
}
