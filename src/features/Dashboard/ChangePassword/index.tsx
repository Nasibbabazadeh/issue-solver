import { closeBtn } from "@/assets/imgs";
import { Button, Input, Loader } from "@/features/common";
import API from "@/http/api";
import { useRequestMutation } from "@/http/request";
import { Box, Divider, Typography } from "@mui/material";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import Image from "next/image";
import { useRef, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ValidationSchema from "./schema";

type FormValues = z.infer<typeof ValidationSchema>;

interface IChangePassword {
    openPasswordModal: boolean;
    setOpenPasswordModal: React.Dispatch<React.SetStateAction<boolean>>
};

const ChangePassword = ({ openPasswordModal, setOpenPasswordModal }: IChangePassword) => {
    const { trigger: updatePasswordTrigger } = useRequestMutation(API.user_update_password, { method: 'PUT' });
    const modelRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);

    const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
        if (modelRef?.current && !modelRef?.current?.contains(e.target as Node)) {
            setOpenPasswordModal(false);
        };
    };

    const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        try {
            setLoader(true);
            setError(null);
            const data = {
                currentPassword: values.password,
                password: values.newPassword,
                confirmPassword: values.confirmPassword
            };
            await updatePasswordTrigger({ body: data });
            actions.setSubmitting(false);
            setOpenPasswordModal(false);
        } catch (error: any) {
            setError(error?.response?.data?.message);
        } finally {
            setLoader(false);
            actions.resetForm({
                values: {
                    password: "",
                    newPassword: "",
                    confirmPassword: ""
                }
            })
        }
    };

    return (
        <>
            <div className={`${openPasswordModal ? 'fixed' : 'hidden'} top-0 bottom-0 left-0 z-40 right-0 bg-black/20 flex flex-col items-center justify-center`}
                onClick={handleOutsideClick}
            >
                <div className="bg-white rounded-lg shadow py-8 px-6 lg:w-4/12 md:w-6/12 sm:w-7/12 relative"
                    ref={modelRef}
                >
                    <div className="absolute -top-4 -right-4 cursor-pointer">
                        <button onClick={() => setOpenPasswordModal(false)}>
                            <Image alt="" src={closeBtn} />
                        </button>
                    </div>
                    <div className="w-full">
                        <Box className="select-none">
                            <Typography color="initial" fontSize={28} fontWeight={600}>
                                Yeni Şifrə
                            </Typography>
                            <Typography fontSize={15} fontWeight={400} sx={{ color: "#9D9D9D" }} noWrap>
                                Zəhmət olmasa, aşağıda məlumatlarınızı qeyd edin
                            </Typography>
                        </Box>
                        <Divider
                            color="#2981FF"
                            sx={{ height: "0.5px", width: "100%", border: "0.5px", opacity: "20%", marginBlock: "1rem" }}
                        />

                        <Formik
                            initialValues={{
                                password: "",
                                newPassword: "",
                                confirmPassword: ""
                            }}
                            onSubmit={handleSubmit}
                            validationSchema={toFormikValidationSchema(ValidationSchema)}
                            validateOnBlur={true}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                touched,
                                isValid,
                                dirty,
                            }: FormikProps<FormValues>) => (
                                <Form onSubmit={handleSubmit}>
                                    <Box display="flex" flexDirection="column">
                                        <Field
                                            name="password"
                                            labelText="Cari Şifrə"
                                            type="password"
                                            autoComplete="password"
                                            component={Input}
                                            placeholder="Cari şifrənizi qeyd edin"
                                            errorText={touched.password && errors.password ? errors.password : undefined}
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Field
                                            name="newPassword"
                                            labelText="Yeni Şifrə"
                                            type="password"
                                            component={Input}
                                            placeholder="Yeni şifrənizi qeyd edin"
                                            autoComplete="newPassword"
                                            errorText={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Field
                                            name="confirmPassword"
                                            labelText="Yeni Şifrə Təsdiqi"
                                            type="password"
                                            component={Input}
                                            placeholder="Yeni şifrənizi təsdiq edin"
                                            autoComplete="confirmPassword"
                                            errorText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />

                                        {error && <Typography color="red">{error}</Typography>}
                                        <Button type="submit" variant="primary" disabled={!isValid || !dirty}>
                                            Yenilə
                                        </Button>
                                    </Box>

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            <Loader loader={loader} />
        </>
    )
}

export default ChangePassword