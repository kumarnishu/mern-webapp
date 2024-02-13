import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import UploadFileButton from '../../buttons/UploadFileButton';
import { CreateShoeWeight, GetArticles, GetDyes, GetMachines } from '../../../services/ProductionServices';
import { IArticle, IDye, IMachine } from '../../../types/production.types';


type TformData = {
    machine: string,
    dye: string,
    article: string,
    weight: number
}

function CreateShoeWeightForm() {
    const [file, setFile] = useState<File>()
    const { data: dyes } = useQuery<AxiosResponse<IDye[]>, BackendError>("dyes", async () => GetDyes())
    const { data: machines } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", async () => GetMachines())
    const { data: articles } = useQuery<AxiosResponse<IArticle[]>, BackendError>("articles", async () => GetArticles())
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            body: FormData;
        }>
        (CreateShoeWeight, {
            onSuccess: () => {
                queryClient.invalidateQueries('shoe_weights')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            machine: "",
            dye: "",
            article: "",
            weight: 0
        },
        validationSchema: Yup.object({
            weight: Yup.number().required("required weight"),
            machine: Yup.string().required("required machine"),
            article: Yup.string().required("required article"),
            dye: Yup.string().required("required dye")

        }),
        onSubmit: (values: TformData) => {
            if (file) {
                let formdata = new FormData()
                let Data = {
                    weight: values.weight,
                    article: values.article,
                    dye: values.dye,
                    machine: values.machine
                }
                formdata.append("body", JSON.stringify(Data))
                formdata.append("media", file)
                mutate({ body: formdata })
                setFile(undefined)
            }
            else {
                alert("Upload a file")
            }
        }
    });

    useEffect(() => {
        if (file)
            setFile(file)
    }, [file])

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: ProductionChoiceActions.close_production })
        }
    }, [isSuccess, setChoice])



    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ pt: 2 }}
                >
                    {/* machine */}
                    < TextField
                        select
                       
                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.machine && formik.errors.machine ? true : false
                        }
                        id="machine"
                        helperText={
                            formik.touched.machine && formik.errors.machine ? formik.errors.machine : ""
                        }
                        {...formik.getFieldProps('machine')}
                        required
                        label="Select Machine"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {
                            machines && machines.data && machines.data.map((machine, index) => {
                                return (<option key={index} value={machine._id}>
                                    {machine.display_name}
                                </option>)

                            })
                        }
                    </TextField>
                    {/* articles */}
                    < TextField
                        select
                       
                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.article && formik.errors.article ? true : false
                        }
                        id="article"
                        helperText={
                            formik.touched.article && formik.errors.article ? formik.errors.article : ""
                        }
                        {...formik.getFieldProps('article')}
                        required
                        label="Select Article"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {
                            articles && articles.data && articles.data.map((article, index) => {
                                return (<option key={index} value={article._id}>
                                    {article.display_name}
                                </option>)
                            })
                        }
                    </TextField>
                    {/* dyes */}
                    < TextField
                        select
                       
                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.dye && formik.errors.dye ? true : false
                        }
                        id="dye"
                        helperText={
                            formik.touched.dye && formik.errors.dye ? formik.errors.dye : ""
                        }
                        {...formik.getFieldProps('dye')}
                        required
                        label="Select Dye"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {
                            dyes && dyes.data && dyes.data.map((dye, index) => {
                                return (<option key={index} value={dye._id}>
                                    {dye.dye_number}
                                </option>)

                            })
                        }
                    </TextField>

                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        label="Shoe Weight"
                        error={
                            formik.touched.weight && formik.errors.weight ? true : false
                        }
                        id="weight"
                        helperText={
                            formik.touched.weight && formik.errors.weight ? formik.errors.weight : ""
                        }
                        {...formik.getFieldProps('weight')}
                    />
                    <UploadFileButton name="media" required={true} camera={true} isLoading={isLoading} label="Upload Shoe Weight Photo" file={file} setFile={setFile} disabled={isLoading} />

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="Added Shoe weight" color="success" />
                        ) : null
                    }
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                </Stack>
            </Stack>
        </form >
    )
}

export default CreateShoeWeightForm
