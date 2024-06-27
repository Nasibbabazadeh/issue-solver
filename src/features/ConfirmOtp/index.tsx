"use client";
import { Button } from "@/features/common";
import API from "@/http/api";
import { useRequestMutation } from "@/http/request";
import { Box, Divider, Grid, OutlinedInput, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import style from './confirmOtp.module.scss';

let currentOTPIndex: number;

const ConfirmOtp = () => {
    const { trigger: confirmOtpTrigger, data: otpTrustResponse } = useRequestMutation(API.otp_trust, { method: 'POST' });
    const { trigger: resendOtpTrigger } = useRequestMutation(API.resend_otp, { method: 'POST' });
    const [otp, setOtp] = useState<string[]>(new Array(7).fill(''));
    const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
    const [success, setSuccess] = useState<boolean>(true);
    const [otpError, setOtpError] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [timer, setTimer] = useState(180);
    const [btnsDisabled, setBtnsDisabled] = useState({
        primaryBtn: true,
        secondaryBtn: true
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
        const { value } = target;
        const newOTP: string[] = [...otp];
        newOTP[currentOTPIndex] = value.substring(value.length - 1);
        if (index == 2 && value) {
            currentOTPIndex = 3;
        }
        if (!value && currentOTPIndex === 4) {
            currentOTPIndex = 3;
        }
        if (!value) {
            setActiveOTPIndex(currentOTPIndex - 1);
        } else {
            setActiveOTPIndex(currentOTPIndex + 1);
        }
        setOtp(newOTP);
    };

    const startCountdown = (onTick: any) => {
        let timerFunc = setInterval(() => {
            onTick((prevTimer: number) => {
                if (prevTimer <= 0) {
                    clearInterval(timerFunc);
                    return 0;
                } else {
                    return prevTimer - 1;
                }
            });
        }, 1000);

        return timerFunc;
    };

    useEffect(() => {
        const timerFunc = startCountdown(setTimer);
        return () => clearInterval(timerFunc);
    }, [timer]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    useEffect(() => {
        if (activeOTPIndex === 7) {
            setBtnsDisabled(prevState => ({
                ...prevState,
                primaryBtn: false
            }));
        }
        if (timer == 0) {
            setBtnsDisabled({
                primaryBtn: true,
                secondaryBtn: false
            });
        }
    }, [activeOTPIndex, timer]);

    useEffect(() => {
        if (otpTrustResponse && otpTrustResponse?.data) {
            const otpToken = otpTrustResponse?.data;
            sessionStorage.setItem('otp_token', otpToken);
            console.log("otpTrustResponse: ", otpTrustResponse);
        } else {
            console.error("otpTrustResponse or its data is undefined.");
        }
    }, [otpTrustResponse]);

    const handleKeyDownOn = ({ key }: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        currentOTPIndex = index;
        setOtpError(null);
        if (key === 'Backspace') {
            if (currentOTPIndex === 4) {
                setActiveOTPIndex(currentOTPIndex);
            } else {
                setActiveOTPIndex(currentOTPIndex - 1);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const otpCode = otp?.join("");
            await confirmOtpTrigger({ body: { otpCode: otpCode } });
            setOtpError(null);
            setSuccess(true);
            router.push("/change-password");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setOtpError(error?.response?.data?.message);
                setSuccess(false);
                setBtnsDisabled(prevState => ({
                    ...prevState,
                    secondaryBtn: true
                }));
            }
        }
    };

    const handleSendOtpAgainBtn = async () => {
        setSuccess(true);
        setOtp(new Array(7).fill(''));
        setActiveOTPIndex(0);
        try {
            const email = sessionStorage.getItem("user_email");
            await resendOtpTrigger({ body: { email: email } });
            setOtpError(null);
            setOpenPopup(false);
            setTimer(180);
        } catch (error) {
            if (error instanceof AxiosError) {
                setTimer(0);
                setOpenPopup(true);
                setBtnsDisabled({
                    primaryBtn: true,
                    secondaryBtn: true
                });
            };
        };
    };

    return (
        <Box className={style.confirm_otp_container} component="div">
            {openPopup && (
                <Box className={style.overlay}>
                    <Box className={style.popup_container}>
                        <Box className={style.popup_content}>
                            <Typography>Daha sonra yenidən cəhd edin</Typography>
                            <Button variant="secondary" onClick={() => router.push("/login")}>Oldu</Button>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box component="div" className={style.confirm_otp_content}>
                <Box component="div">
                    <Typography className={style.form_title}>Təsdiq kodu</Typography>
                    <Typography className={style.sub_title}>E-poçtunuza gələn təsdiq kodunu daxil edin</Typography>
                    <Divider className={style.divider} component="hr" />
                </Box>

                <Grid container component="div" className={style.otp_input_container}>
                    {otp?.map((_, index) => (
                        index === 3 ? (
                            <Grid item key={index} sx={{
                                height: "100% !importance",
                            }} className={style.hyphen}>
                                <Box component="div" width="100%" height="1px" border="1px solid #2981FF" />
                            </Grid>
                        ) : (
                            <Grid item key={index} textAlign="center" >
                                <OutlinedInput
                                    className={style.otp_input}
                                    sx={success ? null : { border: "2px solid #EF5648", backgroundColor: "#FF3D2C0F" }}
                                    inputProps={{
                                        style: { textAlign: "center", border: 0, outline: 0 }
                                    }}
                                    inputRef={index === activeOTPIndex ? inputRef : null}
                                    onKeyDown={(e) => handleKeyDownOn(e, index)}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e, index)}
                                />
                            </Grid>
                        )
                    ))}
                </Grid>

                <Box component="div" height={20}>
                    {timer != 0 && (
                        <Typography fontSize="17px" color="#2981FF">
                            Qalan vaxt: {`${Math.floor(timer / 60)}`.padStart(2, "0")}:{`${timer % 60}`.padStart(2, "0")}
                        </Typography>
                    )}
                </Box>

                {otpError && <Typography color="red">{otpError}</Typography>}

                <Box component="div" marginTop="83px">
                    <Button variant="primary" onClick={handleSubmit} disabled={btnsDisabled.primaryBtn ? true : false} fullWidth sx={{
                        textTransform: "capitalize"
                    }}>Təsdiqlə</Button>
                </Box>

                <Box component="div" textAlign="center" paddingBlock="16px">
                    <Button variant="secondary" fullWidth disabled={btnsDisabled.secondaryBtn ? true : false} onClick={handleSendOtpAgainBtn} sx={{
                        textTransform: "capitalize"
                    }}>Kodu yenidən göndər</Button>
                </Box>
            </Box>
        </Box>
    )
};

export default ConfirmOtp;

// email page -de user email localda qalmalidir.
// change password page-de ise responde body-de olan data localda qalmalidir. eger experie date kecibse o zaman localSt silinmelidir. - bunu status code esasen teyin
// etmeliyem.

// tesdiqleye basanda - otp trust
/**
 * {
  "data": "CdAumAoD/jc6bAJclKhwaMFJr0JgyyqLcJMwd1NRmo1coucZ02V0wXmck05ueYOqtWusTbFXhYMqgls1tdbfOg==",
  "success": true,
  "status": 200,
  "message": "otp is confirm.."
}
 */

// kodu yeniden gonder - reset otp

/**
 * {
  "success": true,
  "status": 200,
  "message": "new opt code send to gmail"
 }
 */

// change password da user_email silmek lazimdir.