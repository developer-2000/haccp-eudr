<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name') }} — Contact Notification</title>
</head>
<body style="margin:0; padding:0; background:#eef6ff; font-family: Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef6ff; padding:20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px;">
                <tr>
                    <td style="background:#1062b9; padding:15px 20px; border-top-left-radius:8px; border-top-right-radius:8px; color:#ffffff; font-size:18px; font-weight:bold;">
                        {{ __('contact.admin_heading') }}
                    </td>
                </tr>
                <tr>
                    <td style="padding:25px 20px;">
                        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:14px; color:#333;">
                            <tr>
                                <td style="font-weight:bold; width:130px; vertical-align:top;">{{ __('contact.admin_label_name') }}:</td>
                                <td>{{ $name }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">{{ __('contact.admin_label_email') }}:</td>
                                <td>{{ $email }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">{{ __('contact.admin_label_company') }}:</td>
                                <td>{{ $company }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">{{ __('contact.admin_label_message') }}:</td>
                                <td>{!! nl2br(e($messageText)) !!}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 20px 10px;">
                        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:12px; color:#666; border-top:1px solid #eee;">
                            <tr>
                                <td style="font-weight:bold; width:130px;">{{ __('contact.admin_label_locale') }}:</td>
                                <td>{{ $locale }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold;">{{ __('contact.admin_label_ip') }}:</td>
                                <td>{{ $ip }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">{{ __('contact.admin_label_user_agent') }}:</td>
                                <td style="word-break: break-all;">{{ $userAgent }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:10px 20px 20px; font-size:12px; color:#999;">
                        {{ config('app.name') }} &mdash; {{ now()->format('d.m.Y H:i') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
