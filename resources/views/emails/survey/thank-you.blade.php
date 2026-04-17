<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name') }} demo</title>
</head>
<body style="margin:0; padding:0; background:#eef6ff; font-family: Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef6ff; padding:20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; padding:30px;">
                {{-- Header --}}
                <tr>
                    <td style="background:#1062b9; padding:15px 20px; border-top-left-radius:8px; border-top-right-radius:8px;">
                        <table width="100%">
                            <tr>
                                <td style="color:#ffffff; font-size:18px; font-weight:bold;">
                                    {{ config('app.name') }} demo
                                </td>
                                <td align="right">
                                    <img src="https://res.cloudinary.com/dgisx7rv4/image/upload/f_auto,q_auto/favicon-32x32_a1njvt" style="width: 25px;" alt="Logo">
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="color:#cfe3ff; font-size:12px;">
                                    {{ __('survey.email.header_tagline') }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Title --}}
                <tr>
                    <td style="color:#273a55; font-size:20px; font-weight:bold; padding-top:20px;">
                        {{ __('survey.email.title') }}
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Greeting --}}
                <tr>
                    <td style="color:#4b5563; font-size:14px; line-height:1.6;">
                        @if($recipientName)
                            {{ __('survey.email.greeting_with_name', ['name' => $recipientName]) }}
                        @else
                            {{ __('survey.email.greeting_default') }}
                        @endif
                        <br><br>
                        {{ __('survey.email.thank_you') }}<br>
                        {{ __('survey.email.value_note') }}
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Discount block --}}
                <tr>
                    <td style="background:#edfaf2; padding:15px; border-radius:6px;">
                        <span style="color:#273a55; font-weight:bold;">
                            {{ __('survey.email.registered_as') }}
                        </span><br><br>
                        <span style="color:#16a34a; font-size:16px; font-weight:bold;">
                            {{ __('survey.email.discount_label') }}
                        </span><br><br>
                        {{ __('survey.email.discount_code_label') }}<br>
                        <span style="font-size:18px; font-weight:bold; color:#1062b9;">
                            {{ $discountCode }}
                        </span>
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Description --}}
                <tr>
                    <td style="color:#4b5563; font-size:14px; line-height:1.6;">
                        {{ __('survey.email.description_line1') }}<br><br>
                        {{ __('survey.email.description_line2') }}<br><br>
                        {{ __('survey.email.description_line3') }}
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Benefits --}}
                <tr>
                    <td style="color:#273a55; font-weight:bold;">
                        {{ __('survey.email.benefits_title') }}
                    </td>
                </tr>
                <tr>
                    <td style="color:#4b5563; font-size:14px; line-height:1.6;">
                        &mdash; {{ __('survey.email.benefit_1') }}<br>
                        &mdash; {{ __('survey.email.benefit_2') }}<br>
                        &mdash; {{ __('survey.email.benefit_3') }}
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- CTA --}}
                <tr>
                    <td align="center">
                        <a href="{{ $siteUrl }}" style="background:#22c55e; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block; font-weight:bold;">
                            {{ __('survey.email.cta_button') }}
                        </a>
                    </td>
                </tr>

                <tr><td height="20"></td></tr>

                {{-- Footer --}}
                <tr>
                    <td style="color:#6b7280; font-size:12px; line-height:1.5;">
                        {{ __('survey.email.footer_updates') }}<br><br>
                        {{ __('survey.email.footer_feedback') }}<br><br>
                        {{ __('survey.email.footer_reply') }}<br><br>
                        {{ __('survey.email.footer_signature') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
