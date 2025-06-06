'use client'

import UserManager from '@/components/UserManagerPage/UserManager'
import AdminWithAuth from "@/components/AdminWithAuth";

function UserManagerPage() {
  return (
    <div className="managers-page-container px-6 py-4">
      <UserManager />
    </div>
  )
}


export default AdminWithAuth(UserManagerPage);