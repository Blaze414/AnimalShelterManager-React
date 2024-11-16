'use client'

import { MedicalRecords } from "@/components/medical/medical-records"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function MedicalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <Button asChild>
          <Link href="/medical/new">
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Link>
        </Button>
      </div>
      <MedicalRecords />
    </div>
  )
}