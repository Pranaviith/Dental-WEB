import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Users, Search, Eye, UserPlus, Filter, ArrowLeft } from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number | null;
  phone: string;
  email: string;
  registrationDate: string;
  status: string;
}

const ViewPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    // Load patients from localStorage
    const savedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    
    // Add some demo patients if none exist
    if (savedPatients.length === 0) {
      const demoPatients = [
        {
          id: 'PAT-001',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          age: 35,
          phone: '+1-555-0123',
          email: 'john.doe@email.com',
          registrationDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          status: 'Active'
        },
        {
          id: 'PAT-002',
          firstName: 'Sarah',
          lastName: 'Wilson',
          gender: 'female',
          age: 28,
          phone: '+1-555-0456',
          email: 'sarah.wilson@email.com',
          registrationDate: new Date(Date.now() - 86400000 * 15).toISOString(),
          status: 'Active'
        },
        {
          id: 'PAT-003',
          firstName: 'Mike',
          lastName: 'Johnson',
          gender: 'male',
          age: 42,
          phone: '+1-555-0789',
          email: 'mike.johnson@email.com',
          registrationDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: 'Under Treatment'
        },
        {
          id: 'PAT-004',
          firstName: 'Emily',
          lastName: 'Davis',
          gender: 'female',
          age: 31,
          phone: '+1-555-0321',
          email: 'emily.davis@email.com',
          registrationDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'Completed'
        }
      ];
      localStorage.setItem('patients', JSON.stringify(demoPatients));
      setPatients(demoPatients);
      setFilteredPatients(demoPatients);
    } else {
      setPatients(savedPatients);
      setFilteredPatients(savedPatients);
    }
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  const getCurrentPagePatients = () => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    const endIndex = startIndex + patientsPerPage;
    return filteredPatients.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleViewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Under Treatment':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Patient Records
            </h1>
            <p className="text-muted-foreground">
              Manage and view all patient information
            </p>
          </div>
        </div>
        
        <Button 
          variant="medical" 
          onClick={() => navigate('/add-patient')}
          className="animate-scale-in"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="animate-fade-in shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find patients by name, ID, or phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, patient ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-soft"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-slide-in shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{patients.length}</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </CardContent>
        </Card>
        <Card className="animate-slide-in shadow-soft" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {patients.filter(p => p.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="animate-slide-in shadow-soft" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {patients.filter(p => p.status === 'Under Treatment').length}
            </div>
            <div className="text-sm text-muted-foreground">Under Treatment</div>
          </CardContent>
        </Card>
        <Card className="animate-slide-in shadow-soft" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {patients.filter(p => p.status === 'Completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Table */}
      <Card className="animate-fade-in shadow-soft" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>
            Showing {getCurrentPagePatients().length} of {filteredPatients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">S.No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Reg. Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPagePatients().map((patient, index) => (
                  <TableRow 
                    key={patient.id} 
                    className="animate-fade-in hover:bg-accent/5 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">
                      {(currentPage - 1) * patientsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                      <div className="text-sm text-muted-foreground">{patient.email}</div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-accent/20 px-2 py-1 rounded text-sm">
                        {patient.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{patient.gender}</span>
                    </TableCell>
                    <TableCell>{patient.age || 'N/A'}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{formatDate(patient.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(patient.id)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewPatients;