
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Wallet,
  ArrowUpRight,
  Download,
  Receipt,
  Users,
  CircleDollarSign,
  ArrowRightLeft,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Receipt className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Balance Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Total Balance</h3>
              <Wallet className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-3xl font-bold">$24,560.00</p>
            <p className="text-sm text-gray-500 mt-2">Updated 2 mins ago</p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 col-span-2">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-5 gap-4">
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <CircleDollarSign className="h-5 w-5" />
                <span>Collect</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <ArrowUpRight className="h-5 w-5" />
                <span>Payout</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <ArrowUpRight className="h-5 w-5" />
                <span>Send</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <ArrowRightLeft className="h-5 w-5" />
                <span>Exchange</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <Download className="h-5 w-5" />
                <span>Download</span>
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {/* Invoices */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Invoices</h3>
              <Receipt className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #1234</p>
                  <p className="text-sm text-gray-500">Due in 3 days</p>
                </div>
                <span className="font-medium">$1,200.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #1235</p>
                  <p className="text-sm text-gray-500">Due in 5 days</p>
                </div>
                <span className="font-medium">$850.00</span>
              </div>
            </div>
          </Card>

          {/* Customers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Customers</h3>
              <Users className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">jane@example.com</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payments Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Payments</h3>
              <BarChart className="h-5 w-5 text-gray-500" />
            </div>
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Payment history chart will be displayed here</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Index
