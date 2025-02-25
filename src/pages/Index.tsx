import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Search,
  Settings,
  Bell,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreVertical,
  LogOut,
  User,
  HelpCircle,
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

const Index = () => {
  const { signOut, session } = useAuth()
  const userEmail = session?.user?.email || ""
  const [firstName, lastName] = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">WavePay</h1>
              <nav className="flex gap-6">
                <Link to="/" className="text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link to="/payments" className="text-sm font-medium text-gray-500">
                  Payments
                </Link>
                <Link to="/history" className="text-sm font-medium text-gray-500">
                  History
                </Link>
                <Link to="/settings" className="text-sm font-medium text-gray-500">
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
                  className="pl-10 bg-gray-100 border-0"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{firstName?.[0]}{lastName?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content 
                    className="w-56 bg-white rounded-lg shadow-lg p-2 mt-2"
                    align="end"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm text-gray-900">{firstName} {lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                    </div>
                    <div className="py-2">
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                        <Link to="/settings" className="flex items-center gap-2 w-full">
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                        <Link to="/support" className="flex items-center gap-2 w-full">
                          <HelpCircle className="h-4 w-4" />
                          Support
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                      <DropdownMenu.Item 
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </DropdownMenu.Item>
                    </div>
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
          <h2 className="text-2xl font-semibold">Payments overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-1.5">
              <img src="/mastercard.svg" alt="Mastercard" className="h-5 w-5" />
              <span className="text-sm font-medium">•••• 0234</span>
            </div>
            <Button className="gap-2">
              <span>New payment</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-12">
          {/* Balance Card */}
          <Card className="col-span-5 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Total balance</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">+2%</span>
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-3xl font-bold mb-6">$26,592.00</p>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 px-3">
                <div className="flex flex-col items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-xs">Send</span>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3">
                <div className="flex flex-col items-center gap-1">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-xs">Request</span>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3">
                <div className="flex flex-col items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Export</span>
                </div>
              </Button>
            </div>
          </Card>

          {/* Scheduled Transfers */}
          <Card className="col-span-7 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium">Scheduled transfers</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="outline" size="sm">Completed</Button>
                <Button variant="outline" size="sm" className="bg-gray-900 text-white">Pending</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Amy P.</p>
                    <p className="text-sm text-gray-500">Germany</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">€375.00</p>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Michael S.</p>
                    <p className="text-sm text-gray-500">United States</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">$460.00</p>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="col-span-12 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium">Total sent</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Columns
                </Button>
                <Button variant="outline" size="sm">Line</Button>
                <select className="text-sm border rounded-md px-2 py-1">
                  <option>Last month</option>
                </select>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} dot={false} />
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
