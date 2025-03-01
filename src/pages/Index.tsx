
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronUp,
  BanknoteIcon,
  SendIcon
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardLayout } from "@/components/layout/DashboardLayout"

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
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {/* Balance Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Your balance</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <BanknoteIcon className="h-4 w-4" />
                Add money
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="col-span-12 md:col-span-4 space-y-6">
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
    </DashboardLayout>
  );
};

export default Index;
