
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Bell,
  ChevronDown,
  Plus,
  Search,
  Settings,
  Wallet2,
  ChevronUp,
  BanknoteIcon,
  SendIcon
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

const data = [
  { name: 'Jun 21', amount: 400 },
  { name: 'Jun 22', amount: 300 },
  { name: 'Jun 23', amount: 500 },
  { name: 'Jun 24', amount: 280 },
  { name: 'Jun 25', amount: 590 },
  { name: 'Jun 26', amount: 390 },
  { name: 'Jun 27', amount: 490 },
]

const Index = () => {
  const { signOut, session } = useAuth()
  const userEmail = session?.user?.email || ""
  const [firstName, lastName] = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  )

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" alt="Logo" className="h-8 w-8" />
                <h1 className="text-xl font-semibold text-gray-900">DaPay</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for transactions"
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d" />
                      <AvatarFallback>{firstName?.[0]}{lastName?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="w-56 bg-white rounded-lg shadow-lg p-2 mt-2" align="end">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm text-gray-900">{firstName} {lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                    </div>
                    <div className="py-2">
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer" onClick={signOut}>
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
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Balance Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Your balance</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wallet2 className="h-4 w-4" />
                  Add money
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available balance</p>
                  <p className="text-3xl font-semibold">$12,560.00</p>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <ChevronUp className="h-4 w-4" />
                    <span>+2.5%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending balance</p>
                  <p className="text-3xl font-semibold">$1,214.00</p>
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <ChevronDown className="h-4 w-4" />
                    <span>-0.8%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chart Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Analytics</h2>
                <select className="text-sm border rounded-lg px-3 py-2">
                  <option>Last 7 days</option>
                  <option>Last month</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#013c3f" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, fill: "#013c3f" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 px-3 border-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <SendIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Send Money</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4 px-3 border-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                      <BanknoteIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Request</span>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Recent transactions</h2>
                <Button variant="ghost" size="sm" className="text-[#013c3f]">
                  See all
                </Button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://images.unsplash.com/photo-${1570295999919 + i}-56ceb5ecca61`} />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Alex Morris</p>
                        <p className="text-sm text-gray-500">Today at 7:45 AM</p>
                      </div>
                    </div>
                    <p className="font-medium">-$250.00</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Index
