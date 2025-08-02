import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, UserPlus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AddPatient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: undefined as Date | undefined,
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name and Phone).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const patientId = `PAT-${Date.now().toString().slice(-6)}`;
      
      // Save to localStorage (mock database)
      const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const newPatient = {
        id: patientId,
        ...formData,
        age: formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null,
        registrationDate: new Date().toISOString(),
        status: 'Active'
      };
      
      existingPatients.push(newPatient);
      localStorage.setItem('patients', JSON.stringify(existingPatients));

      toast({
        title: "Patient Added Successfully!",
        description: `${formData.firstName} ${formData.lastName} has been registered with ID: ${patientId}`,
      });

      setIsSubmitting(false);
      navigate('/patients');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <UserPlus className="w-8 h-8 text-primary" />
            Add New Patient
          </h1>
          <p className="text-muted-foreground">Register a new patient in the system</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl animate-scale-in shadow-large bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-xl">Patient Information</CardTitle>
          <CardDescription>Please fill in the patient details below</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 animate-slide-in">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
              
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
            </div>

            {/* Gender and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="transition-all duration-300 focus:shadow-soft">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '300ms' }}>
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-300 focus:shadow-soft",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '400ms' }}>
                <Label>Age</Label>
                <Input
                  readOnly
                  value={formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : ''}
                  placeholder="Auto-calculated"
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '500ms' }}>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
              
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '600ms' }}>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 animate-slide-in" style={{ animationDelay: '700ms' }}>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="transition-all duration-300 focus:shadow-soft"
                rows={3}
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2 animate-slide-in" style={{ animationDelay: '800ms' }}>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                placeholder="Emergency contact name and phone"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>

            {/* Medical History */}
            <div className="space-y-2 animate-slide-in" style={{ animationDelay: '900ms' }}>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Any relevant medical history, allergies, or conditions..."
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                className="transition-all duration-300 focus:shadow-soft"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                variant="medical" 
                size="lg"
                disabled={isSubmitting}
                className="animate-slide-in"
                style={{ animationDelay: '1000ms' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Patient...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Patient
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default AddPatient;