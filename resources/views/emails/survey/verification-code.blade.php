<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HACCPilot verification</title>
</head>
<body style="margin:0; padding:0; background:#eef6ff; font-family: Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef6ff; padding:20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                {{-- Header --}}
                <tr>
                    <td style="background:#1062b9; padding:15px 20px;">
                        <table width="100%">
                            <tr>
                                <td style="color:#ffffff; font-size:16px; font-weight:bold;">
                                    HACCPilot verification
                                </td>
                                <td align="right">
                                    <img src="https://res.cloudinary.com/dgisx7rv4/image/upload/f_auto,q_auto/favicon-32x32_a1njvt" style="width:25px;" alt="Logo">
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="color:#cfe3ff; font-size:12px;">
                                    {{ __('survey.email_verify.header_tagline') }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Title --}}
                <tr>
                    <td style="padding:25px 25px 10px; color:#273a55; font-size:18px; font-weight:bold;">
                        {{ __('survey.email_verify.title') }}
                    </td>
                </tr>

                {{-- Text --}}
                <tr>
                    <td style="padding:0 25px; color:#4b5563; font-size:14px; line-height:1.6;">
                        {{ __('survey.email_verify.description') }}<br><br>
                        {{ __('survey.email_verify.instruction') }}
                    </td>
                </tr>

                {{-- Code block --}}
                <tr>
                    <td style="padding:20px 25px;">
                        <table width="100%" style="background:#f7f6f2; border:1px solid #e5e7eb; border-radius:8px;">
                            <tr>
                                <td align="center" style="padding:25px;">
                                    <div style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#1062b9;">
                                        {{ $verificationCode }}
                                    </div>
                                    <div style="margin-top:10px; font-size:12px; color:#6b7280;">
                                        {{ __('survey.email_verify.code_expiry') }}
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Warning --}}
                <tr>
                    <td style="padding:0 25px; color:#6b7280; font-size:13px; line-height:1.6;">
                        {{ __('survey.email_verify.not_you') }}<br>
                        {{ __('survey.email_verify.data_safe') }}
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- CTA --}}
                <tr>
                    <td align="center">
                        <a href="{{ config('app.url') }}" style="background:#22c55e; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block; font-weight:bold;">
                        {{ __('survey.email.cta_button') }}
                        </a>
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Footer --}}
                <tr>
                    <td style="padding:0 25px 25px; color:#6b7280; font-size:12px; line-height:1.5;">
                        {{ __('survey.email_verify.footer_auto') }}<br>
                        {{ __('survey.email_verify.footer_purpose') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
