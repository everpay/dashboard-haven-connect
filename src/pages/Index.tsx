
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Settings,
  Bell,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreVertical,
  LogOut,
  CreditCard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from "react-router-dom"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

const data = [
  { name: 'Sep 25', amount: 400 },
  { name: 'Sep 26', amount: 600 },
  { name: 'Sep 27', amount: 450 },
  { name: 'Sep 28', amount: 350 },
  { name: 'Sep 29', amount: 500 },
  { name: 'Sep 30', amount: 450 },
  { name: 'Oct 1', amount: 400 },
]

const transactions = [
  {
    id: 1,
    name: "Amy P.",
    status: "Scheduled",
    country: "Germany",
    amount: "€375.00",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Michael S.",
    status: "Processing",
    country: "United States",
    amount: "$460.00",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
  }
]

const Index = () => {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold tracking-tight">WavePay</h1>
              <nav className="flex gap-6">
                <Link to="/" className="text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link to="/payments" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  Payments
                </Link>
                <Link to="/history" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  History
                </Link>
                <Link to="/settings" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 bg-gray-50 border-0 focus:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" className="rounded-full p-0">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="min-w-[200px] bg-white rounded-lg shadow-lg p-2 mt-2">
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
                      <Link to="/settings" className="flex items-center gap-2 w-full">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Payments overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0EA5E9] text-white rounded-xl px-4 py-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm font-medium">•••• 0234</span>
            </div>
            <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl gap-2">
              <span>New payment</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-12">
          {/* Balance Card */}
          <Card className="col-span-5 p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">Total balance</h3>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">+2%</span>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-6">$26,592.00</p>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 px-3 hover:bg-gray-50 border-gray-200">
                <div className="flex flex-col items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Send</span>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 hover:bg-gray-50 border-gray-200">
                <div className="flex flex-col items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Request</span>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 hover:bg-gray-50 border-gray-200">
                <div className="flex flex-col items-center gap-1">
                  <Download className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Export</span>
                </div>
              </Button>
            </div>
          </Card>

          {/* Scheduled Transfers */}
          <Card className="col-span-7 p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-gray-900">Scheduled transfers</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">All</Button>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">Completed</Button>
                <Button variant="outline" size="sm" className="bg-gray-900 text-white hover:bg-gray-800 border-0">Pending</Button>
              </div>
            </div>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={transaction.image} />
                      <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-900">{transaction.amount}</p>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart */}
          <Card className="col-span-12 p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-gray-900">Total sent</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 text-gray-600 border-gray-200 hover:bg-gray-50">
                  <ArrowUpRight className="h-4 w-4" />
                  Columns
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">Line</Button>
                <select className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 border-gray-200 bg-white hover:bg-gray-50">
                  <option>Last month</option>
                </select>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                  />
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
