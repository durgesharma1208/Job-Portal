import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { Alert } from "./ui/Kit";

const OTP_LENGTH = 6;

const OtpVerification = ({
  email,
  title = "Verify OTP",
  subtitle,
  onVerify,
  onResend,
  loading = false,
  resending = false,
  remainingResend,
  buttonLabel = "Verify OTP",
}) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = window.setInterval(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  const otp = digits.join("");

  const updateDigit = (index, value) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextValue;
    setDigits(nextDigits);

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!pastedDigits.length) return;

    const nextDigits = Array(OTP_LENGTH).fill("");
    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setDigits(nextDigits);
    inputRefs.current[Math.min(pastedDigits.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleVerify = (event) => {
    event.preventDefault();
    if (otp.length === OTP_LENGTH) onVerify(otp);
  };

  const handleResend = async () => {
    await onResend();
    setDigits(Array(OTP_LENGTH).fill(""));
    setCountdown(60);
  };

  const resendDisabled = countdown > 0 || resending || remainingResend === 0;

  return (
    <form onSubmit={handleVerify} className="grid gap-4">
      <div>
        <h3 className="text-lg font-black text-text-strong">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-text-muted">
          {subtitle || `Enter the 6-digit code sent to ${email}.`}
        </p>
      </div>

      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            aria-label={`OTP digit ${index + 1}`}
            className="input-premium h-12 w-11 text-center text-lg font-black sm:w-12"
            required
          />
        ))}
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={otp.length !== OTP_LENGTH}>
        {buttonLabel}
      </Button>

      <div className="flex flex-col gap-2 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{countdown > 0 ? `Resend available in ${countdown}s` : "Didn't receive the code?"}</span>
        <Button type="button" variant="ghost" size="sm" loading={resending} disabled={resendDisabled} onClick={handleResend}>
          Resend OTP
        </Button>
      </div>

      {typeof remainingResend === "number" && (
        <Alert type={remainingResend === 0 ? "error" : "info"}>
          {remainingResend} resend attempt{remainingResend === 1 ? "" : "s"} remaining.
        </Alert>
      )}
    </form>
  );
};

export default OtpVerification;
