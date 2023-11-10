import { useContext, useEffect, useState } from 'react'
import { ILead, IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetLead, GetReminderRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, Button, DialogTitle, IconButton, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import NewRemarkDialog from '../../components/dialogs/crm/NewRemarkDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import DeleteRemarkDialog from '../../components/dialogs/crm/DeleteRemarkDialog'
import { Delete, Edit } from '@mui/icons-material'
import UpdateRemarkDialog from '../../components/dialogs/crm/UpdateRemarkDialog'
import { UserContext } from '../../contexts/userContext'

function CrmReminderPage() {
  const [remarks, setRemarks] = useState<IRemark[]>([])
  const [lead, setLead] = useState<ILead>()
  const [id, setId] = useState("")
  const [remark, setRemark] = useState<IRemark>()
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IRemark[]>, BackendError>("reminderremarks", GetReminderRemarks)
  const { data: remotelead, isSuccess: isLeadSuccess, refetch } = useQuery<AxiosResponse<ILead>, BackendError>(["lead", id], async () => GetLead(id), { enabled: false })
  const [display, setDisplay] = useState<boolean>(false)
  const { setChoice } = useContext(ChoiceContext)
  let previous_date = new Date()
  let day = previous_date.getDate() - 1
  previous_date.setDate(day)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (isLeadSuccess)
      setLead(remotelead.data)
  }, [isLeadSuccess, remotelead])

  useEffect(() => {
    refetch()
  }, [id])

  useEffect(() => {
    if (isSuccess)
      setRemarks(data?.data)
  }, [remarks, isSuccess, data])

  return (
    <Box>
      {
        isLoading && <LinearProgress />
      }
      <DialogTitle sx={{ textAlign: 'center' }}>Reminders</DialogTitle>
      <Stack direction={"column"}>
        <Box>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
          </Typography>
          {remarks && remarks.map((remark, index) => {
            return (
              <Stack key={index}
                direction="column"
              >
                <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Lead : <b>{remark.lead && remark.lead.name}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Lead Phone : <b>{remark.lead && remark.lead.mobile}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Lead Address : <b>{remark.lead && remark.lead.address}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Remark : <b>{remark.remark}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Remark Added By : <b>{remark.created_by.username}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Remark Added On : {new Date(remark.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    Remind date : <b>{new Date(remark.remind_date).toLocaleString()}</b>
                  </Typography>
                  <Stack direction={'row'} gap={2}>
                    <Button onClick={() => {
                      setId(remark.lead._id)
                      setChoice({ type: LeadChoiceActions.add_remark })
                    }}>Add Remark</Button>
                    <Button onClick={() => {
                      setRemark(remark)
                      setId(remark.lead._id)
                      setChoice({ type: LeadChoiceActions.view_remarks })
                    }}>View {remark && remark.lead && remark.lead.remarks && remark.lead.remarks.length ? remark.lead.remarks.length : null} Remarks</Button>
                    {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="error" onClick={() => {
                      setRemark(remark)
                      setChoice({ type: LeadChoiceActions.delete_remark })
                    }}><Delete /></IconButton>}
                    {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="success" onClick={() => {
                      setRemark(remark)
                      setChoice({ type: LeadChoiceActions.update_remark })
                    }}><Edit /></IconButton>}</Stack>
                </Paper>
              </Stack>
            )
          })}
        </Box >
        {lead ?
          <>
            <NewRemarkDialog lead={lead} />
            <ViewRemarksDialog lead={lead} />
          </> : null
        }
        {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
        {remark && <UpdateRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
      </Stack >
    </Box >
  )
}

export default CrmReminderPage