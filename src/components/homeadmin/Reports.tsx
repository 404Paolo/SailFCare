
import { Card, CardContent } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-xl font-semibold">Appointments Today</h4>
            <p className="text-5xl font-semibold m-8">Test</p>
            <p className="text-md text-gray-500">Number of appointments today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-xl font-semibold">Walk-In Today</h4>
            <p className="text-5xl font-semibold m-8">Test</p>
            <p className="text-md text-gray-500">Number of walk-in patients today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-xl font-semibold">Upcoming Appointments</h4>
            <p className="text-5xl font-semibold m-8">Test</p>
            <p className="text-md text-gray-500">Number of upcoming appointments tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-xl font-semibold">Upcoming Appointments</h4>
            <p className="text-5xl font-semibold m-8">Test</p>
            <p className="text-md text-gray-500">Number of upcoming appointments tomorrow</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports;