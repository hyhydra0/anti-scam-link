import { Box, Container, Typography, Paper, TextField, Checkbox, FormControlLabel, Button, Divider, AppBar, Toolbar, Stack, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from './useLanguage'
import { getTranslations } from './locales'
import { useState } from 'react'

interface PrincipalInfo {
  fullName: string
  nationality: string
  nationalId: string
  address: string
  phone: string
  email: string
}

interface AttorneyInfo {
  fullName: string
  lawFirm: string
  barLicense: string
  address: string
  phone: string
  email: string
}

interface Powers {
  draftDocuments: boolean
  submitApplications: boolean
  negotiations: boolean
  claimActions: boolean
  receiveFunds: boolean
  other: boolean
  otherDescription: string
}

function PowerOfAttorney() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = getTranslations(lang).powerOfAttorney

  const [principalInfo, setPrincipalInfo] = useState<PrincipalInfo>({
    fullName: '',
    nationality: '',
    nationalId: '',
    address: '',
    phone: '',
    email: '',
  })

  const [attorneyInfo, setAttorneyInfo] = useState<AttorneyInfo>({
    fullName: '',
    lawFirm: '',
    barLicense: '',
    address: '',
    phone: '',
    email: '',
  })

  const [powers, setPowers] = useState<Powers>({
    draftDocuments: false,
    submitApplications: false,
    negotiations: false,
    claimActions: false,
    receiveFunds: false,
    other: false,
    otherDescription: '',
  })

  const [termFrom, setTermFrom] = useState('')
  const [termTo, setTermTo] = useState('')
  const [copiesCount, setCopiesCount] = useState('')
  const [authorityName, setAuthorityName] = useState('')

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" color="primary" enableColorOnDark className="print:hidden">
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
            <Link href="#" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.privacy}</Link>
            <Link href="#" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.terms}</Link>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-6 sm:py-8 print:py-4">
        <Paper className="p-6 sm:p-8 print:p-4" sx={{ '@media print': { boxShadow: 'none' } }}>
          {/* Document Title */}
          <Typography variant="h4" className="text-center mb-8 font-bold">
            {t.documentTitle}
          </Typography>

          {/* Principal Information */}
          <Typography variant="h6" className="mb-4 font-semibold">
            {t.principalInfo}
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextField
              label={`• ${t.principalFullName}`}
              value={principalInfo.fullName}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, fullName: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.principalNationality}`}
              value={principalInfo.nationality}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, nationality: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.principalNationalId}`}
              value={principalInfo.nationalId}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, nationalId: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.principalAddress}`}
              value={principalInfo.address}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, address: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.principalPhone}`}
              value={principalInfo.phone}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, phone: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.principalEmail}`}
              value={principalInfo.email}
              onChange={(e) => setPrincipalInfo({ ...principalInfo, email: e.target.value })}
              fullWidth
              variant="standard"
            />
          </Box>

          {/* Attorney Information */}
          <Typography variant="h6" className="mb-4 mt-8 font-semibold">
            {t.attorneyInfo}
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextField
              label={`• ${t.attorneyFullName}`}
              value={attorneyInfo.fullName}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, fullName: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.attorneyLawFirm}`}
              value={attorneyInfo.lawFirm}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, lawFirm: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.attorneyBarLicense}`}
              value={attorneyInfo.barLicense}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, barLicense: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.attorneyAddress}`}
              value={attorneyInfo.address}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, address: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.attorneyPhone}`}
              value={attorneyInfo.phone}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, phone: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label={`• ${t.attorneyEmail}`}
              value={attorneyInfo.email}
              onChange={(e) => setAttorneyInfo({ ...attorneyInfo, email: e.target.value })}
              fullWidth
              variant="standard"
            />
          </Box>

          {/* Powers Granted */}
          <Typography variant="h6" className="mb-4 mt-8 font-semibold">
            {t.powersGranted}
          </Typography>
          <Box className="mb-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={powers.draftDocuments}
                  onChange={(e) => setPowers({ ...powers, draftDocuments: e.target.checked })}
                />
              }
              label={`• ${t.powerDraftDocuments}`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={powers.submitApplications}
                  onChange={(e) => setPowers({ ...powers, submitApplications: e.target.checked })}
                />
              }
              label={`• ${t.powerSubmitApplications}`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={powers.negotiations}
                  onChange={(e) => setPowers({ ...powers, negotiations: e.target.checked })}
                />
              }
              label={`• ${t.powerNegotiations}`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={powers.claimActions}
                  onChange={(e) => setPowers({ ...powers, claimActions: e.target.checked })}
                />
              }
              label={`• ${t.powerClaimActions}`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={powers.receiveFunds}
                  onChange={(e) => setPowers({ ...powers, receiveFunds: e.target.checked })}
                />
              }
              label={`• ${t.powerReceiveFunds}`}
            />
            <Box className="mt-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={powers.other}
                    onChange={(e) => setPowers({ ...powers, other: e.target.checked })}
                  />
                }
                label={`• ${t.powerOther}:`}
              />
              {powers.other && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={powers.otherDescription}
                  onChange={(e) => setPowers({ ...powers, otherDescription: e.target.value })}
                  className="mt-2"
                  variant="standard"
                />
              )}
            </Box>
          </Box>

          {/* Term of Authority */}
          <Typography variant="h6" className="mb-4 mt-8 font-semibold">
            {t.termOfAuthority}
          </Typography>
          <Box className="mb-6">
            <Box className="flex items-center gap-4 mb-4">
              <Typography variant="body1" className="font-semibold">
                {t.termFrom}
              </Typography>
              <TextField
                value={termFrom}
                onChange={(e) => setTermFrom(e.target.value)}
                variant="standard"
                placeholder="____/____/____"
                className="w-32"
              />
              <Typography variant="body1" className="font-semibold">
                {t.termTo}
              </Typography>
              <TextField
                value={termTo}
                onChange={(e) => setTermTo(e.target.value)}
                variant="standard"
                placeholder="____/____/____"
                className="w-32"
              />
            </Box>
            <Typography variant="body2" className="text-gray-600">
              {t.termDescription}
            </Typography>
          </Box>

          {/* Principal's Declaration */}
          <Typography variant="h6" className="mb-4 mt-8 font-semibold">
            {t.principalDeclaration}
          </Typography>
          <Box className="mb-6">
            <Typography variant="body1" className="mb-2">
              • {t.declaration1}
            </Typography>
            <Typography variant="body1" className="mb-2">
              • {t.declaration2}
            </Typography>
            <Box className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap">
              <Box className="flex items-center gap-2 flex-wrap">
                <Typography variant="body1">• {t.declaration3Part1}</Typography>
                <TextField
                  value={copiesCount}
                  onChange={(e) => setCopiesCount(e.target.value)}
                  variant="standard"
                  placeholder="__"
                  className="w-16"
                  inputProps={{ style: { fontSize: '1rem', padding: '4px 0 4px 0' } }}
                />
                <Typography variant="body1">{t.declaration3Part2}</Typography>
                <TextField
                  value={authorityName}
                  onChange={(e) => setAuthorityName(e.target.value)}
                  variant="standard"
                  placeholder="__"
                  className="w-32"
                  inputProps={{ style: { fontSize: '1rem', padding: '4px 0 4px 0' } }}
                />
              </Box>
              <Typography variant="body1">{t.declaration3Part3} {t.declaration3Part4}</Typography>
            </Box>
          </Box>

          {/* Signatures */}
          <Typography variant="h6" className="mb-4 mt-8 font-semibold">
            {t.signatures}
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" sx={{ '@media print': { pageBreakInside: 'avoid' } }}>
            <Box>
              <TextField
                label={t.principalSignature}
                fullWidth
                variant="standard"
                className="mb-4"
              />
              <TextField
                label={t.principalDate}
                variant="standard"
                placeholder="____/____/____"
                className="w-32"
              />
            </Box>
            <Box>
              <TextField
                label={t.attorneySignature}
                fullWidth
                variant="standard"
                className="mb-4"
              />
              <TextField
                label={t.attorneyDate}
                variant="standard"
                placeholder="____/____/____"
                className="w-32"
              />
            </Box>
          </Box>

          {/* Important Notes */}
          <Divider className="mb-4 print:hidden" />
          <Typography variant="body2" className="text-gray-600 font-semibold print:hidden">
            {t.importantNotes}
          </Typography>

          {/* Submit Button */}
          <Box className="flex gap-4 justify-center mt-8 print:hidden">
            <Button variant="contained" color="primary" size="large">
              {t.submit}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Divider className="print:hidden" />
      <Box component="footer" className="py-4 print:hidden">
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" className="gap-2 text-center">
            <Typography variant="caption" color="text.secondary" className="text-xs sm:text-sm">
              {t.copyright}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default PowerOfAttorney

