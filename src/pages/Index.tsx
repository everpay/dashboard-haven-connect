
import { useAuth } from "@/lib/auth"
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
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
]

const Index = () => {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon">
              <Receipt className="h-5 w-5 text-zinc-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5 text-zinc-600" />
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
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-900">Total Balance</h3>
              <Wallet className="h-5 w-5 text-zinc-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">$24,560.00</p>
            <p className="text-sm text-zinc-500 mt-2">Updated 2 mins ago</p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 col-span-2 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-zinc-900 mb-4">Quick Actions</h3>
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
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-900">Invoices</h3>
              <Receipt className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">Invoice #1234</p>
                  <p className="text-sm text-zinc-500">Due in 3 days</p>
                </div>
                <span className="font-medium text-zinc-900">$1,200.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">Invoice #1235</p>
                  <p className="text-sm text-zinc-500">Due in 5 days</p>
                </div>
                <span className="font-medium text-zinc-900">$850.00</span>
              </div>
            </div>
          </Card>

          {/* Customers */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-900">Customers</h3>
              <Users className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-zinc-900">John Doe</p>
                  <p className="text-sm text-zinc-500">john@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-zinc-900">Jane Smith</p>
                  <p className="text-sm text-zinc-500">jane@example.com</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payments Chart */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-900">Payments</h3>
              <BarChart className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Index
