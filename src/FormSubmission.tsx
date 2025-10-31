import { useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  FormControlLabel,
  AppBar,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Link,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import ImageUpload from './ImageUpload'
import { Language, getTranslations } from './locales'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DatePickerLocalization } from './DatePickerLocalization'
import dayjs, { Dayjs } from 'dayjs'

interface TransferRecord {
  date: string
  amount: string
  paymentMethod: string
  payeeInfo: string
}

interface FormSubmissionData {
  // Step 1
  victimName: string
  gender: string
  birthDate: string
  idNumber: string
  address: string
  contactPhone: string
  opponentIdentity: string
  opponentName: string
  contactMethod: string
  bankAccount: string
  opponentAddress: string

  // Step 2
  scamMethod: string
  contactTime: string
  scamProcess: string
  lastContactTime: string
  scamReason: string
  userOperation: string

  // Step 3
  transfers: TransferRecord[]
  totalLoss: string

  // Step 4
  paymentVoucher: File[]
  communicationRecords: File[]
  websiteAppScreenshots: File[]
  policeReportReceipt: File[]
  otherEvidence: File[]
  consultedOtherLawFirms: boolean
}

function FormSubmission() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [lang, setLang] = useState<Language>('zh')

  const t = getTranslations(lang).formSubmission
  
  const steps = [t.stepBasicInfo, t.stepScamDetails, t.stepTransferRecords, t.stepEvidence]

  const handleLangChange = (_event: React.MouseEvent<HTMLElement>, value: Language | null) => {
    if (value) {
      setLang(value)
    }
  }
  const [formData, setFormData] = useState<FormSubmissionData>({
    victimName: '',
    gender: '',
    birthDate: '',
    idNumber: '',
    address: '',
    contactPhone: '',
    opponentIdentity: '',
    opponentName: '',
    contactMethod: '',
    bankAccount: '',
    opponentAddress: '',
    scamMethod: '',
    contactTime: '',
    scamProcess: '',
    lastContactTime: '',
    scamReason: '',
    userOperation: '',
    transfers: [{ date: '', amount: '', paymentMethod: '', payeeInfo: '' }],
    totalLoss: '0',
    paymentVoucher: [],
    communicationRecords: [],
    websiteAppScreenshots: [],
    policeReportReceipt: [],
    otherEvidence: [],
    consultedOtherLawFirms: false,
  })

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleChange = (field: keyof FormSubmissionData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown; checked?: boolean } }
  ) => {
    const value = 'checked' in event.target ? event.target.checked : event.target.value
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleTransferChange = (index: number, field: keyof TransferRecord) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newTransfers = [...formData.transfers]
    newTransfers[index] = {
      ...newTransfers[index],
      [field]: event.target.value,
    }
    const total = newTransfers.reduce((sum, transfer) => {
      const amount = parseFloat(transfer.amount) || 0
      return sum + amount
    }, 0)
    setFormData({
      ...formData,
      transfers: newTransfers,
      totalLoss: total.toFixed(2),
    })
  }

  const calculateTotalLoss = (transfers: TransferRecord[]) => {
    const total = transfers.reduce((sum, transfer) => {
      const amount = parseFloat(transfer.amount) || 0
      return sum + amount
    }, 0)
    return total.toFixed(2)
  }

  const addTransfer = () => {
    setFormData({
      ...formData,
      transfers: [...formData.transfers, { date: '', amount: '', paymentMethod: '', payeeInfo: '' }],
    })
  }

  const removeTransfer = (index: number) => {
    const newTransfers = formData.transfers.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      transfers: newTransfers,
      totalLoss: calculateTotalLoss(newTransfers),
    })
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    // Handle final submission here
    alert(lang === 'zh' ? '表单提交成功！' : 'Form submitted successfully!')
    navigate('/')
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              {t.victimInfo}
            </Typography>
            <TextField
              label={t.victimName}
              fullWidth
              value={formData.victimName}
              onChange={handleChange('victimName')}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>{t.gender}</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleChange('gender')({ target: { value: e.target.value } })}
                label={t.gender}
              >
                <MenuItem value={t.genderMale}>{t.genderMale}</MenuItem>
                <MenuItem value={t.genderFemale}>{t.genderFemale}</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label={t.birthDate}
              value={formData.birthDate ? dayjs(formData.birthDate) : null}
              onChange={(newValue: Dayjs | null) => {
                handleChange('birthDate')({ target: { value: newValue ? newValue.format('YYYY-MM-DD') : '' } })
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
            <TextField
              label={t.idNumber}
              fullWidth
              value={formData.idNumber}
              onChange={handleChange('idNumber')}
              required
            />
            <TextField
              label={t.address}
              fullWidth
              value={formData.address}
              onChange={handleChange('address')}
              required
            />
            <TextField
              label={t.contactPhone}
              fullWidth
              value={formData.contactPhone}
              onChange={handleChange('contactPhone')}
              required
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              {t.opponentInfo}
            </Typography>
            <FormControl fullWidth required>
              <InputLabel>{t.opponentIdentity}</InputLabel>
              <Select
                value={formData.opponentIdentity}
                onChange={(e) => handleChange('opponentIdentity')({ target: { value: e.target.value } })}
                label={t.opponentIdentity}
              >
                <MenuItem value={t.identityIndividual}>{t.identityIndividual}</MenuItem>
                <MenuItem value={t.identityCompany}>{t.identityCompany}</MenuItem>
                <MenuItem value={t.identityOrganization}>{t.identityOrganization}</MenuItem>
                <MenuItem value={t.identityUnknown}>{t.identityUnknown}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t.opponentName}
              fullWidth
              placeholder={t.opponentNamePlaceholder}
              value={formData.opponentName}
              onChange={handleChange('opponentName')}
              required
            />
            <TextField
              label={t.contactMethod}
              fullWidth
              placeholder={t.contactMethodPlaceholder}
              value={formData.contactMethod}
              onChange={handleChange('contactMethod')}
              required
            />
            <TextField
              label={t.bankAccount}
              fullWidth
              placeholder={t.bankAccountPlaceholder}
              value={formData.bankAccount}
              onChange={handleChange('bankAccount')}
              required
            />
            <TextField
              label={t.opponentAddress}
              fullWidth
              placeholder={t.opponentAddressPlaceholder}
              value={formData.opponentAddress}
              onChange={handleChange('opponentAddress')}
              required
            />
          </Stack>
        )

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              {t.scamProcessAndDetails}
            </Typography>
            <TextField
              label={t.scamMethod}
              fullWidth
              multiline
              rows={4}
              value={formData.scamMethod}
              onChange={handleChange('scamMethod')}
              required
            />
            <TextField
              label={t.contactTime}
              fullWidth
              placeholder={t.contactTimePlaceholder}
              multiline
              rows={4}
              value={formData.contactTime}
              onChange={handleChange('contactTime')}
              required
            />
            <TextField
              label={t.scamProcess}
              fullWidth
              placeholder={t.scamProcessPlaceholder}
              multiline
              rows={4}
              value={formData.scamProcess}
              onChange={handleChange('scamProcess')}
              required
            />
            <DateTimePicker
              label={t.lastContactTime}
              value={formData.lastContactTime ? dayjs(formData.lastContactTime) : null}
              onChange={(newValue: Dayjs | null) => {
                handleChange('lastContactTime')({ target: { value: newValue ? newValue.format('YYYY-MM-DD HH:mm:ss') : '' } })
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
            <Divider />
            <Typography variant="h6" gutterBottom>
              {t.scamTactics}
            </Typography>
            <TextField
              label={t.scamReason}
              fullWidth
              multiline
              rows={4}
              value={formData.scamReason}
              onChange={handleChange('scamReason')}
              required
            />
            <Divider />
            <Typography variant="h6" gutterBottom>
              {t.userOperation}
            </Typography>
            <TextField
              label={t.userOperationPlaceholder}
              fullWidth
              multiline
              rows={4}
              value={formData.userOperation}
              onChange={handleChange('userOperation')}
              required
            />
          </Stack>
        )

      case 2:
        return (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6">{t.transferRecords}</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTransfer}
              >
                {t.addTransfer}
              </Button>
            </Box>
            <Stack spacing={2}>
              {formData.transfers.map((transfer, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {t.sequenceNumber}: {index + 1}
                      </Typography>
                      {formData.transfers.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeTransfer(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Stack spacing={2}>
                      <DatePicker
                        label={t.transferDate}
                        value={transfer.date ? dayjs(transfer.date) : null}
                        onChange={(newValue: Dayjs | null) => {
                          const event = {
                            target: { value: newValue ? newValue.format('YYYY-MM-DD') : '' }
                          } as React.ChangeEvent<HTMLInputElement>
                          handleTransferChange(index, 'date')(event)
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                      <TextField
                        label={t.transferAmount}
                        type="number"
                        fullWidth
                        value={transfer.amount}
                        onChange={handleTransferChange(index, 'amount')}
                        placeholder={t.transferAmountPlaceholder}
                      />
                      <TextField
                        label={t.paymentMethod}
                        fullWidth
                        value={transfer.paymentMethod}
                        onChange={handleTransferChange(index, 'paymentMethod')}
                        placeholder={t.paymentMethodPlaceholder}
                      />
                      <TextField
                        label={t.payeeInfo}
                        fullWidth
                        value={transfer.payeeInfo}
                        onChange={handleTransferChange(index, 'payeeInfo')}
                        placeholder={t.payeeInfoPlaceholder}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t.totalLoss}
                    </Typography>
                    <Typography variant="h6" color="error">
                      ¥{formData.totalLoss}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        )

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              {t.evidenceTypes}
            </Typography>
            
            <ImageUpload
              label={t.paymentVoucher}
              placeholder={t.paymentVoucherPlaceholder}
              value={formData.paymentVoucher}
              onChange={(files) => setFormData({ ...formData, paymentVoucher: files })}
              maxImages={20}
            />

            <ImageUpload
              label={t.communicationRecords}
              placeholder={t.communicationRecordsPlaceholder}
              value={formData.communicationRecords}
              onChange={(files) => setFormData({ ...formData, communicationRecords: files })}
              maxImages={30}
            />

            <ImageUpload
              label={t.websiteAppScreenshots}
              placeholder={t.websiteAppScreenshotsPlaceholder}
              value={formData.websiteAppScreenshots}
              onChange={(files) => setFormData({ ...formData, websiteAppScreenshots: files })}
              maxImages={20}
            />

            <ImageUpload
              label={t.policeReportReceipt}
              placeholder={t.policeReportReceiptPlaceholder}
              value={formData.policeReportReceipt}
              onChange={(files) => setFormData({ ...formData, policeReportReceipt: files })}
              maxImages={10}
            />

            <ImageUpload
              label={t.otherEvidence}
              placeholder={t.otherEvidencePlaceholder}
              value={formData.otherEvidence}
              onChange={(files) => setFormData({ ...formData, otherEvidence: files })}
              maxImages={20}
            />

            <Divider />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consultedOtherLawFirms}
                  onChange={(e) => handleChange('consultedOtherLawFirms')({ target: { value: e.target.checked } })}
                />
              }
              label={t.consultedOtherLawFirms}
            />
            {formData.consultedOtherLawFirms && (
              <TextField
                fullWidth
                placeholder={t.pleaseSpecify}
                multiline
                rows={4}
              />
            )}
          </Stack>
        )

      default:
        return null
    }
  }

  return (
    <DatePickerLocalization lang={lang}>
      <Box className="min-h-screen flex flex-col">
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar className="justify-between flex-wrap gap-3">
            <Typography 
              variant="h6" 
              className="font-semibold cursor-pointer"
              onClick={() => navigate('/')}
              sx={{ '&:hover': { opacity: 0.8 } }}
            >
              {t.headerTitle}
            </Typography>
            <Stack direction="row" spacing={2} className="items-center flex-wrap">
              <ToggleButtonGroup
                color="secondary"
                size="small"
                exclusive
                value={lang}
                onChange={handleLangChange}
              >
                <ToggleButton value="zh">{t.toggleZh}</ToggleButton>
                <ToggleButton value="en">{t.toggleEn}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" className="flex-1 py-6 sm:py-8">
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                {t.formSubmissionTitle}
              </Typography>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          display: { xs: 'none', sm: 'block' },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mb: 4, minHeight: '400px' }}>
                {renderStepContent()}
              </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                {t.stepBack}
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" onClick={handleSubmit}>
                    {t.stepSubmit}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    {t.stepNext}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
          </Container>

        <Divider />
        <Box component="footer" className="py-4">
          <Container maxWidth="md">
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={{ xs: 'center', sm: 'space-between' }} alignItems={{ xs: 'center', sm: 'center' }} className="gap-2 text-center sm:text-left">
              <Typography variant="caption" color="text.secondary" className="text-xs sm:text-[0.8rem]">
                {t.copyright}
              </Typography>
              <Stack direction="row" spacing={2} className="flex-wrap justify-center sm:justify-end">
                <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.privacy}</Link>
                <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.terms}</Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </DatePickerLocalization>
  )
}

export default FormSubmission

