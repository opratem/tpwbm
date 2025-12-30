"use client";

/**
 * Example: How to use Enhanced Admin Components
 *
 * This file shows how to integrate the new admin components into your pages.
 */

import { useState, useEffect } from "react";
import { EnhancedDataTable, type Column, type BulkAction } from "@/components/admin/enhanced-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, UserCheck, UserX, Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  phone?: string;
}

export function UsersTableExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Define table columns
  const columns: Column<User>[] = [
    {
      header: "Name",
      accessor: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[hsl(218,31%,18%)] text-white flex items-center justify-center text-sm font-medium">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-[hsl(218,31%,18%)]">{row.name}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      cell: (row) => {
        const colors: Record<string, string> = {
          admin: "bg-red-100 text-red-700",
          member: "bg-blue-100 text-blue-700",
          visitor: "bg-slate-100 text-slate-700",
        };
        return (
          <Badge className={colors[row.role] || "bg-slate-100"}>
            {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessor: "isActive",
      sortable: true,
      cell: (row) => (
        <Badge className={row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      mobileHidden: true,
      cell: (row) => (
        <span className="text-sm text-slate-600">{row.phone || "—"}</span>
      ),
    },
    {
      header: "Joined",
      accessor: "createdAt",
      sortable: true,
      mobileHidden: true,
      cell: (row) => (
        <span className="text-sm text-slate-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Edit", row.id)}>
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("View", row.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Email", row.id)}>
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete", row.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Activate Selected",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (ids) => {
        console.log("Activate users:", ids);
        // Implement activate logic
      },
    },
    {
      label: "Deactivate Selected",
      icon: <UserX className="h-4 w-4" />,
      onClick: (ids) => {
        console.log("Deactivate users:", ids);
        // Implement deactivate logic
      },
    },
    {
      label: "Send Email",
      icon: <Mail className="h-4 w-4" />,
      onClick: (ids) => {
        console.log("Send email to:", ids);
        // Implement email logic
      },
    },
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (ids) => {
        console.log("Delete users:", ids);
        // Implement delete logic
      },
      variant: "destructive" as const,
    },
  ];

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(218,31%,18%)]">User Management</h1>
          <p className="text-slate-600 mt-2">Manage church members and administrators</p>
        </div>
        <Button className="bg-[hsl(218,31%,18%)] hover:bg-[hsl(218,31%,25%)] text-white">
          Add New User
        </Button>
      </div>

      <EnhancedDataTable
        data={users}
        columns={columns}
        searchable
        searchPlaceholder="Search by name, email, or phone..."
        bulkActions={bulkActions}
        onRefresh={fetchUsers}
        loading={loading}
        emptyMessage="No users found"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
        getId={(row) => row.id}
      />
    </div>
  );
}
