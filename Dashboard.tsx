import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Calendar,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeCases: 0,
    completedTreatments: 0,
    todayAppointments: 0
  });

  // Animated count-up effect
  useEffect(() => {
    const targetStats = {
      totalPatients: 247,
      activeCases: 18,
      completedTreatments: 156,
      todayAppointments: 8
    };

    const animateValue = (key: keyof typeof stats, target: number) => {
      const increment = target / 30;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 50);
    };

    setTimeout(() => animateValue('totalPatients', targetStats.totalPatients), 200);
    setTimeout(() => animateValue('activeCases', targetStats.activeCases), 400);
    setTimeout(() => animateValue('completedTreatments', targetStats.completedTreatments), 600);
    setTimeout(() => animateValue('todayAppointments', targetStats.todayAppointments), 800);
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      description: '+12% from last month',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Cases',
      value: stats.activeCases,
      icon: UserCheck,
      description: 'Currently under treatment',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Completed Treatments',
      value: stats.completedTreatments,
      icon: FileText,
      description: 'This month: 23 completed',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      description: 'Next: 2:30 PM - John Doe',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient',
      icon: Plus,
      path: '/add-patient',
      variant: 'medical' as const
    },
    {
      title: 'View All Patients',
      description: 'Browse patient records',
      icon: Eye,
      path: '/patients',
      variant: 'outline' as const
    }
  ];

  const recentActivities = [
    { time: '10:30 AM', action: 'New patient registration', patient: 'Sarah Wilson', status: 'completed' },
    { time: '09:15 AM', action: 'Treatment plan updated', patient: 'Mike Johnson', status: 'updated' },
    { time: '08:45 AM', action: 'Examination completed', patient: 'Emily Davis', status: 'completed' },
    { time: 'Yesterday', action: 'Follow-up scheduled', patient: 'Robert Brown', status: 'scheduled' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your practice performance and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          <span className="text-sm text-success font-medium">Practice Growing</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="animate-scale-in shadow-soft hover:shadow-medium transition-all duration-300" 
                style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground animate-count-up">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="animate-fade-in shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start gap-3 h-auto p-4"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 animate-fade-in shadow-soft" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{activity.action}</span>
                      <Badge 
                        variant={
                          activity.status === 'completed' ? 'default' :
                          activity.status === 'updated' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.patient}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Preview */}
      <Card className="animate-fade-in shadow-soft" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Upcoming appointments and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { time: '09:00 AM', patient: 'Alice Cooper', type: 'Cleaning', status: 'confirmed' },
              { time: '10:30 AM', patient: 'Bob Wilson', type: 'Consultation', status: 'confirmed' },
              { time: '02:30 PM', patient: 'John Doe', type: 'Root Canal', status: 'upcoming' },
              { time: '04:00 PM', patient: 'Mary Johnson', type: 'Check-up', status: 'upcoming' }
            ].map((appointment, index) => (
              <div key={index} className="p-3 rounded-lg border border-border bg-card hover:shadow-soft transition-all duration-200">
                <div className="font-medium text-foreground">{appointment.time}</div>
                <div className="text-sm text-muted-foreground">{appointment.patient}</div>
                <div className="text-xs text-accent mt-1">{appointment.type}</div>
                <Badge 
                  variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                  className="text-xs mt-2"
                >
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;