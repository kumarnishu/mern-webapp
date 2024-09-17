import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Box, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { paths } from '../Routes';
import { Menu as MenuIcon } from '@mui/icons-material';
import { toTitleCase } from '../utils/TitleCase';
import FuzzySearch from 'fuzzy-search';
import { UserContext } from '../contexts/userContext';
import { FeatureContext } from '../contexts/featureContext';
import AgarsonLogo, { ButtonLogo } from '../components/logo/Agarson';
import { useContext, useEffect, useState } from 'react';
import { LineChart, PieChart } from '@mui/x-charts';
import ProfileLogo from '../components/logo/ProfileLogo';

function MainDashBoardPage() {
  const navigate = useNavigate()
  const { feature, setFeature } = useContext(FeatureContext)
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext)
  const [features, setFeatures] = useState<{ feature: string, url: string, is_visible?: boolean, icon?: Element }[]>([])
  const [filteredfeatures, setFilteredFeatures] = useState<{ feature: string, url: string, is_visible?: boolean, icon?: Element }[]>([])
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Stack direction={'row'} justifyContent={'center'} mr={4}>
        <Link to={paths.dashboard} replace={true} onClick={() => {
          {
            setFeature({ feature: "Dashboard", url: "/" })
            setSearch("")
            navigate(paths.dashboard)
          }
        }}>
          <AgarsonLogo width={120} height={120} title='Go To Dashboard' />
        </Link>
      </Stack>
      <List>
        {filteredfeatures.map((feat, index) => (
          <>
            {feat && feat.is_visible && < Link style={{ textDecoration: 'none', color: 'black' }} to={feat.url} onClick={() => {
              setFeature({ feature: feat.feature, url: feat.url })
              setSearch("")
            }}>
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={toTitleCase(feat.feature)} />
                </ListItemButton>
              </ListItem>
            </Link >}
            <Divider />
          </>
        ))}
      </List>

    </Box >
  );

  useEffect(() => {
    if (search) {
      const searcher = new FuzzySearch(filteredfeatures, ["feature"], {
        caseSensitive: false,
      });
      const result = searcher.search(search);
      setFeatures(result)
    }

    if (!search)
      setFeatures(filteredfeatures)

  }, [search])

  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible?: boolean, url: string }[] = []
    user?.is_admin && tmpfeatures.push({ feature: 'users', is_visible: true, url: paths.user_dashboard })
    user?.assigned_permissions.includes('crm_menu') && tmpfeatures.push({ feature: 'crm', is_visible: true, url: paths.crm_dashboard })
    user?.assigned_permissions.includes('production_menu') && tmpfeatures.push({ feature: 'productions', is_visible: true, url: paths.production_dashboard })
    user?.assigned_permissions.includes('erp_report_menu') && tmpfeatures.push({ feature: 'erp reports', is_visible: true, url: paths.erp_reports_dashboard })
    user?.is_admin && tmpfeatures.push({ feature: 'Todos', is_visible: true, url: paths.todo_dashboard })
    // tmpfeatures.push({ feature: 'Visit',is_visible: true, url: paths.visit_dashboard })
    user?.assigned_permissions.includes('checklist_menu') && tmpfeatures.push({ feature: 'Checklists', is_visible: true, url: paths.checklist_dashboard })
    // tmpfeatures.push({ feature: 'Templates',is_visible: true, url: paths.templates_dashboard })
    // tmpfeatures.push({ feature: 'BackUp',is_visible: true, url: paths.backup_dashboard })
    user?.assigned_permissions.includes('leads_view') && tmpfeatures.push({ feature: 'leads ', is_visible: false, url: "/crm_dashboard/leads" })
    setFeatures(tmpfeatures)
    setFilteredFeatures(tmpfeatures)

  }, [user])

  return (
    <>

      <Box sx={{ bgcolor: 'red', width: '100%' }}>
        {/* parent stack */}
        <Stack direction="row" sx={{
          justifyContent: "space-between", alignItems: "center"
        }}
        >
          {/* child stack1 */}
          <Stack direction="row" gap={2} pl={2} justifyContent={'center'} alignItems={'center'}>

            <ProfileLogo />

          </Stack>
          {/* child stack2 */}
          <Stack sx={{ direction: 'column', minWidth: '20%', gap: 2 }}>
            <TextField
              style={{ position: 'relative' }}
              placeholder='Search Menu Items'
              size='small'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ backgroundColor: 'whitesmoke', border: 2, borderColor: 'white', borderRadius: 2 }}
            />
            {search != "" && features.length > 0 && <Box style={{ position: 'absolute', backgroundColor: 'white', top: 48, width: '270px', borderRadius: 2, border: '5px', zIndex: 5 }}>
              <List>
                {features.map((feat, index) => (
                  <>
                    <Link style={{ textDecoration: 'none', color: 'black' }} to={feat.url} onClick={() => {
                      setFeature({ feature: feat.feature, url: feat.url })
                      setSearch("")
                    }}>
                      <ListItem key={index} disablePadding>
                        <ListItemButton>

                          <ListItemText primary={toTitleCase(feat.feature)} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                    <Divider />
                  </>
                ))}
              </List>
            </Box>}
          </Stack>
          {/* child stack3 */}
          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems="center"
            gap={2}
          >
            <Link to={feature ? feature.url : "/"} onDoubleClick={() => {
              {
                setFeature({ feature: "Dashboard", url: "/" })
                setSearch("")
                navigate(paths.dashboard)
              }
            }} replace={true} style={{ textDecoration: 'none' }}>
              <Paper sx={{ ml: 2, p: 1, bgcolor: 'white', boxShadow: 1, borderRadius: 1, borderColor: 'white' }}>
                <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                  <ButtonLogo title="" height={20} width={20} />
                  <Typography variant="button" sx={{ fontSize: 12 }} component="div">
                    {feature?.feature || "Dashboard"}
                  </Typography>
                </Stack>
              </Paper>
            </Link>
            <IconButton onClick={toggleDrawer(true)} size='large'>
              < MenuIcon sx={{ width: 35, height: 35, color: 'white' }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box >



      {feature?.feature == "Dashboard" ?

        <>

          <Stack direction={'row'} gap={2} alignItems={'center'}>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              width={500}
              height={300}
            />
          </Stack>

        </>
        :
        <Outlet />}

      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        {DrawerList}
      </Drawer>

    </>

  )
}


export default MainDashBoardPage