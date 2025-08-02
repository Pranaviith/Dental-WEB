import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  Stethoscope,
  Plus,
  Eye,
  Clock
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number | null;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  status: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    // Load patient data
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const foundPatient = patients.find((p: Patient) => p.id === patientId);
    
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      toast({
        title: "Patient Not Found",
        description: "The requested patient could not be found.",
        variant: "destructive"
      });
      navigate('/patients');
    }

    // Mock treatment data
    setTreatments([
      {
        id: 1,
        date: '2024-01-15',
        type: 'Routine Checkup',
        status: 'Completed',
        doctor: 'Dr. Smith',
        notes: 'Regular cleaning and examination. No issues found.'
      },
      {
        id: 2,
        date: '2024-01-28',
        type: 'Cavity Filling',
        status: 'In Progress',
        doctor: 'Dr. Smith',
        notes: 'Small cavity on upper left molar. Treatment scheduled.'
      }
    ]);
  }, [patientId, navigate]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient information...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Under Treatment': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStartExamination = () => {
    navigate(`/examination/${patient.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/patients')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <User className="w-8 h-8 text-primary" />
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="medical" 
            onClick={handleStartExamination}
            className="animate-scale-in"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Start Examination
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <Card className="lg:col-span-1 animate-slide-in shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <Badge variant={getStatusBadgeVariant(patient.status)}>
                {patient.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{patient.gender}, {patient.age || 'N/A'} years old</div>
                  <div className="text-sm text-muted-foreground">Gender & Age</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{patient.phone}</div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                </div>
              </div>
              
              {patient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{patient.email}</div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                  </div>
                </div>
              )}
              
              {patient.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{patient.address}</div>
                    <div className="text-sm text-muted-foreground">Address</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{formatDate(patient.registrationDate)}</div>
                  <div className="text-sm text-muted-foreground">Registration Date</div>
                </div>
              </div>
            </div>

            {patient.emergencyContact && (
              <div className="pt-4 border-t border-border">
                <div className="font-medium text-sm text-muted-foreground mb-2">Emergency Contact</div>
                <div className="text-sm">{patient.emergencyContact}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Treatment History & Medical Records */}
        <Card className="lg:col-span-2 animate-fade-in shadow-soft" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Medical Records & Treatment History</CardTitle>
            <CardDescription>Complete medical information and treatment timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">Treatment History</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
                <TabsTrigger value="uploads">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Treatment Records</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Treatment
                  </Button>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {treatments.map((treatment: any, index) => (
                    <AccordionItem key={treatment.id} value={`treatment-${treatment.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-3">
                            <Badge variant={treatment.status === 'Completed' ? 'default' : 'secondary'}>
                              {treatment.status}
                            </Badge>
                            <span className="font-medium">{treatment.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {formatDate(treatment.date)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-muted-foreground">Treating Doctor:</span>
                              <div className="font-medium">{treatment.doctor}</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Date:</span>
                              <div className="font-medium">{formatDate(treatment.date)}</div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Notes:</span>
                            <div className="mt-1 p-3 bg-accent/20 rounded-lg">{treatment.notes}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Report
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Medical History</h3>
                  {patient.medicalHistory ? (
                    <div className="p-4 bg-accent/20 rounded-lg">
                      <p className="text-sm leading-relaxed">{patient.medicalHistory}</p>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No medical history recorded</p>
                      <Button variant="outline" className="mt-2">Add Medical History</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="uploads" className="space-y-4">
                <div className="text-center p-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded</p>
                  <Button variant="outline" className="mt-2">Upload Documents</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail;