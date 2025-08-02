import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight,
  Stethoscope,
  FileText,
  Camera,
  Upload,
  Heart,
  Thermometer
} from 'lucide-react';

const ExaminationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Chief Complaint & Vitals
    chiefComplaint: '',
    painLevel: '0',
    bloodPressure: '',
    temperature: '',
    pulse: '',
    
    // Step 2: Medical History
    isDiabetic: false,
    hasAsthma: false,
    hasCardiacIssues: false,
    isPregnant: false,
    hba1c: '',
    fastingGlucose: '',
    prandialGlucose: '',
    allergies: '',
    currentMedications: '',
    
    // Step 3: Examination Notes
    oralExamination: '',
    additionalNotes: '',
    images: [] as { file: File; type: 'intraoral' | 'xray' }[]
  });

  const steps = [
    { number: 1, title: 'Chief Complaint & Vitals', icon: Heart },
    { number: 2, title: 'Medical History', icon: FileText },
    { number: 3, title: 'Examination & Images', icon: Camera }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (files: FileList | null, type: 'intraoral' | 'xray') => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles.map(file => ({ file, type }))]
    }));
    
    toast({
      title: "Images Uploaded",
      description: `${newFiles.length} ${type} image(s) uploaded successfully.`,
    });
  };

  const handleSubmit = () => {
    // Save examination data
    const examinationData = {
      patientId,
      date: new Date().toISOString(),
      ...formData
    };

    // Mock saving to localStorage
    const examinations = JSON.parse(localStorage.getItem('examinations') || '[]');
    examinations.push(examinationData);
    localStorage.setItem('examinations', JSON.stringify(examinations));

    toast({
      title: "Examination Completed",
      description: "Patient examination has been recorded successfully.",
    });

    navigate(`/findings/${patientId}`);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive" />
          Chief Complaint & Vitals
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
            <Textarea
              id="chiefComplaint"
              placeholder="Describe the main concern or reason for visit..."
              value={formData.chiefComplaint}
              onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="painLevel">Pain Level (0-10)</Label>
              <Select value={formData.painLevel} onValueChange={(value) => handleInputChange('painLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i} - {i === 0 ? 'No Pain' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : 'Severe'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                placeholder="98.6"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="pulse">Pulse Rate (BPM)</Label>
              <Input
                id="pulse"
                placeholder="72"
                value={formData.pulse}
                onChange={(e) => handleInputChange('pulse', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Medical History
        </h3>
        
        <div className="space-y-6">
          {/* Medical Conditions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Medical Conditions</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diabetic"
                  checked={formData.isDiabetic}
                  onCheckedChange={(checked) => handleInputChange('isDiabetic', checked)}
                />
                <Label htmlFor="diabetic">Diabetic</Label>
              </div>
              
              {formData.isDiabetic && (
                <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/20 rounded-lg animate-fade-in">
                  <div>
                    <Label htmlFor="hba1c">HbA1c (%)</Label>
                    <Input
                      id="hba1c"
                      placeholder="7.0"
                      value={formData.hba1c}
                      onChange={(e) => handleInputChange('hba1c', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fastingGlucose">Fasting Glucose</Label>
                    <Input
                      id="fastingGlucose"
                      placeholder="100"
                      value={formData.fastingGlucose}
                      onChange={(e) => handleInputChange('fastingGlucose', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prandialGlucose">Post-prandial Glucose</Label>
                    <Input
                      id="prandialGlucose"
                      placeholder="140"
                      value={formData.prandialGlucose}
                      onChange={(e) => handleInputChange('prandialGlucose', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="asthma"
                  checked={formData.hasAsthma}
                  onCheckedChange={(checked) => handleInputChange('hasAsthma', checked)}
                />
                <Label htmlFor="asthma">Asthma</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardiac"
                  checked={formData.hasCardiacIssues}
                  onCheckedChange={(checked) => handleInputChange('hasCardiacIssues', checked)}
                />
                <Label htmlFor="cardiac">Cardiac Issues</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pregnant"
                  checked={formData.isPregnant}
                  onCheckedChange={(checked) => handleInputChange('isPregnant', checked)}
                />
                <Label htmlFor="pregnant">Pregnancy</Label>
              </div>
            </div>
          </div>
          
          {/* Allergies */}
          <div>
            <Label htmlFor="allergies">Known Allergies</Label>
            <Textarea
              id="allergies"
              placeholder="List any known allergies..."
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              rows={2}
            />
          </div>
          
          {/* Current Medications */}
          <div>
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              placeholder="List current medications and dosages..."
              value={formData.currentMedications}
              onChange={(e) => handleInputChange('currentMedications', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-accent" />
          Examination & Documentation
        </h3>
        
        <div className="space-y-6">
          {/* Oral Examination */}
          <div>
            <Label htmlFor="oralExamination">Oral Examination Findings</Label>
            <Textarea
              id="oralExamination"
              placeholder="Record detailed examination findings..."
              value={formData.oralExamination}
              onChange={(e) => handleInputChange('oralExamination', e.target.value)}
              rows={6}
            />
          </div>
          
          {/* Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload Intraoral Images</p>
                <input
                  type="file"
                  id="intraoral-upload"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files, 'intraoral')}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('intraoral-upload')?.click()}>
                  Choose Files
                </Button>
                {formData.images.filter(img => img.type === 'intraoral').length > 0 && (
                  <p className="text-xs text-primary mt-2">
                    {formData.images.filter(img => img.type === 'intraoral').length} file(s) selected
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload X-rays</p>
                <input
                  type="file"
                  id="xray-upload"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files, 'xray')}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('xray-upload')?.click()}>
                  Choose Files
                </Button>
                {formData.images.filter(img => img.type === 'xray').length > 0 && (
                  <p className="text-xs text-primary mt-2">
                    {formData.images.filter(img => img.type === 'xray').length} file(s) selected
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional observations or notes..."
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(`/patient/${patientId}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            Patient Examination
          </h1>
          <p className="text-muted-foreground">Patient ID: {patientId}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="animate-fade-in shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <div className={`font-medium text-sm ${
                    currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className={`text-xs ${
                    currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="animate-scale-in shadow-large">
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Record the patient's main concerns and vital signs"}
            {currentStep === 2 && "Document medical history and current conditions"}
            {currentStep === 3 && "Perform examination and upload supporting images"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="medical"
              onClick={handleNextStep}
            >
              {currentStep === 3 ? (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Complete Examination
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExaminationForm;