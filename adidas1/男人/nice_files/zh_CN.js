nike.unite.experience.load({
  "settings": {
    "uxId": "com.nike.commerce.nikedotcom.web",
    "theme": "unite",
    "locale": "zh_CN",
    "dialect": "zh_CN",
    "social": {
      "networks": []
    },
    "environments": {
      "local": {
        "agreementServiceUrl": "https://agreement.test.svs.nike.com/rest/agreement",
        "avatarBaseUrl": "https://www.nike.com/vc/profile",
        "backendEnvironment": "ecn87",
        "cors": "https://unite.nikedev.com",
        "gigyaApiKey": "2_BtC6DfARWcO0QvjrtZ0ewbtaAiSz7AmDJH5oDI211Jt0Qx3ipyoogKnHxom1aag4"
      },
      "ci": {
        "agreementServiceUrl": "https://agreement.test.svs.nike.com/rest/agreement",
        "avatarBaseUrl": "https://www.nike.com/vc/profile",
        "backendEnvironment": "ecn87",
        "cors": "https://unite.nikedev.com",
        "gigyaApiKey": "2_BtC6DfARWcO0QvjrtZ0ewbtaAiSz7AmDJH5oDI211Jt0Qx3ipyoogKnHxom1aag4"
      },
      "production": {
        "agreementServiceUrl": "https://agreementservice.svs.nike.com/rest/agreement",
        "avatarBaseUrl": "https://www.nike.com/vc/profile",
        "backendEnvironment": "",
        "cors": "https://unite.nike.com",
        "gigyaApiKey": "2_IIKHKceEmeqTxf-7vybsrw5g-6NnFG3ykf2bPYS5PwX7T09Mk-ykJZaAZMMIVzTN"
      }
    },
    "resultIncludeUser": false,
    "viewId": "",
    "progressiveFields": [],
    "setCookieOnLogin": true
  },
  "views": {
    "appLanding": {
      "src": "nike-unite-app-landing-view",
      "layout": "{{landingHeader}}{{loginButton}}{{joinButton}}"
    },
    "confirmPasswordReset": {
      "src": "nike-unite-confirm-password-reset-view",
      "layout": "{{confirmPasswordResetBlock}}"
    },
    "error": {
      "src": "nike-unite-error-view",
      "layout": "{{errorPanel}}"
    },
    "join": {
      "aliasFor": false,
      "src": "nike-unite-join-view",
      "classes": [],
      "layout": "{{coppa}}{{joinHeader}}{{#joinForm}}{{emailAddress}}{{passwordCreate}}{{lastName}}{{firstName}}{{dateOfBirth}}{{country}}{{mobileNumber}}{{gender}}{{emailSignup}}{{joinTerms}}{{joinSubmit}}{{/joinForm}}{{currentMemberSignIn}}"
    },
    "link": {
      "src": "nike-unite-link-view",
      "layout": "{{linkHeader}}{{errorMessage}}{{#linkForm}}{{emailAddressDisabled}}{{password}}{{loginOptions}}{{linkAcknowledge}}{{loginTerms}}{{linkSubmit}}{{/linkForm}}",
      "autofocus": true
    },
    "linkNoEmail": {
      "src": "nike-unite-link-no-email-view",
      "layout": "{{linkHeader}}{{#linkNoEmailForm}}{{errorMessage}}{{loginUsername}}{{password}}{{loginOptions}}{{linkAcknowledge}}{{loginTerms}}{{linkNoEmailSubmit}}{{/linkNoEmailForm}}"
    },
    "login": {
      "autofocus": false,
      "src": "nike-unite-login-view",
      "layout": "{{loginHeader}}{{#loginForm}}{{errorMessage}}{{emailAddress}}{{password}}{{keepMeLoggedIn}}{{loginOptions}}{{loginTerms}}{{loginSubmit}}{{socialLogin}}{{loginCreateButton}}{{/loginForm}}"
    },
    "loginContinuity": {
      "src": "nike-unite-login-continuity-view",
      "layout": "{{loginContinuityHeader}}{{loginContinuityDialog}}"
    },
    "loginDropdown": {
      "src": "nike-unite-login-dropdown-view",
      "layout": "{{loginHeader}}{{#loginDropdownForm}}{{errorMessage}}{{emailAddress}}{{password}}{{loginOptions}}{{loginTerms}}{{loginSubmit}}{{loginCreateButton}}{{/loginDropdownForm}}{{socialLogin}}"
    },
    "mobileVerificationCode": {
      "src": "nike-unite-mobile-verification-code-view",
      "layout": "{{verifyCodeHeader}}{{#verifyCodeForm}}{{code}}{{verifyCodeSubmit}}{{/verifyCodeForm}}{{mobileVerificationHelp}}"
    },
    "progressive": {
      "src": "nike-unite-progressive-profile-view",
      "layout": "{{progressiveHeader}}{{#progressiveForm}}{{verifyMobileNumber}}<p>我们将立即向您发送验证码。 如果您的无线提供商存在问题，接收可能会出现延迟。 短信和数据速率可能适用。</p>{{sendCodeSubmit}}{{/progressiveForm}}"
    },
    "reauth": {
      "src": "nike-unite-reauth-view",
      "layout": "{{reauthHeader}}{{#loginForm}}{{errorMessage}}{{reauthEmailAddress}}{{password}}{{loginOptions}}{{loginSubmit}}{{/loginForm}}"
    },
    "resetPassword": {
      "src": "nike-unite-reset-password-view",
      "layout": "{{forgotPasswordBlock}}{{errorMessage}}{{#forgotPasswordForm}}{{resetPasswordUsername}}{{forgotPasswordSubmit}}{{/forgotPasswordForm}}"
    },
    "socialJoin": {
      "src": "nike-unite-join-view",
      "layout": "{{coppa}}{{joinHeader}}{{socialJoinSubheader}}{{#joinForm}}{{emailAddress}}{{passwordCreate}}{{lastName}}{{firstName}}{{dateOfBirth}}{{country}}{{mobileNumber}}{{gender}}{{emailSignup}}{{linkAcknowledge}}{{joinTerms}}{{socialJoinSubmit}}{{/joinForm}}{{currentMemberSignIn}}"
    },
    "updatePassword": {
      "src": "nike-unite-update-password-view",
      "layout": "{{updatePasswordBlock}}{{#updatePasswordForm}}{{passwordCreate}}{{updatePasswordSubmit}}{{/updatePasswordForm}}"
    }
  },
  "components": {
    "coppa": {
      "type": "coppa"
    },
    "errorMessage": {
      "type": "errorMessage"
    },
    "errorMessageUpdatePasswordInvalidToken": {
      "type": "errorMessage",
      "messages": [
        {
          "text": "您的会话已过期。 请给自己发送密码重置邮件。"
        }
      ]
    },
    "errorMessageLogin": {
      "type": "errorMessage",
      "messages": [
        {
          "text": "您输入的电子邮件或密码有误"
        }
      ]
    },
    "errorPanel": {
      "type": "errorPanel",
      "title": "",
      "dismissMessage": "略过此错误",
      "buttonLink": ""
    },
    "errorPanelGeneral": {
      "type": "errorPanel",
      "title": "出错了。",
      "messages": [
        {
          "text": "抱歉，暂时无法连接我们的服务器。 请稍后重试。"
        }
      ]
    },
    "errorPanelSocial": {
      "type": "errorPanel",
      "title": "注册未完成",
      "messages": [
        {
          "text": "抱歉！我们目前无法完成您的注册。 请稍后重试。"
        }
      ]
    },
    "errorPanelCoppa": {
      "type": "errorPanel",
      "title": "不符合注册条件",
      "messages": [
        {
          "text": "抱歉，您不具备资格访问该体验。 如有任何问题或疑虑，请联系客户支持。"
        }
      ],
      "dismissMessage": "客户支持",
      "buttonLink": "https://help-en-us.nike.com/app/contact"
    },
    "errorPanelPreviousCoppaFailure": {
      "type": "errorPanel",
      "title": "不符合注册条件",
      "messages": [
        {
          "text": "由于先前多次尝试失败，因此我们无法完成您的注册。 请联系我们的客户服务团队"
        }
      ],
      "dismissMessage": "客户支持",
      "buttonLink": "https://help-en-us.nike.com/app/contact"
    },
    "updatePasswordForm": {
      "id": "updatePasswordForm",
      "type": "form"
    },
    "updatePasswordSubmit": {
      "type": "submitButton",
      "label": "更新密码",
      "labelProcessing": "正在处理...",
      "formId": "updatePasswordForm",
      "actions": {
        "submit": "updatePassword"
      }
    },
    "loginButton": {
      "type": "actionButton",
      "label": "登录",
      "view": "login"
    },
    "joinButton": {
      "type": "actionButton",
      "label": "加入 NIKE",
      "view": "join"
    },
    "loginCreateButton": {
      "type": "actionButton",
      "label": "创建帐户",
      "view": "join"
    },
    "landingHeader": {
      "type": "block",
      "value": "<header><div class=\"nike-unite-swoosh\"></div><h1>欢迎来到 NIKE</h1><h2>Nike 随时为你服务，助你选购卓越装备，为你提供专业指导、非凡体验和无限动力。</h2></header>"
    },
    "mobileVerificationHelp": {
      "type": "block",
      "value": "<p>mobile.verification.help.code mobile.verification.help.cellular<br /><br />mobile.verification.help.link</p>"
    },
    "socialLoginLink": {
      "type": "viewLink",
      "label": "登录",
      "view": "linkNoEmail",
      "model": "{provider: nike.unite.provider}"
    },
    "linkHeader": {
      "type": "block",
      "value": "<header><div class=\"nike-unite-swoosh\"></div><h1>关联您的帐户</h1><h2 id=\"nike-unite-social-network-replace\">登录 Nike 并将您的帐号关联至 {{provider}}</h2></header>"
    },
    "linkSubmit": {
      "type": "submitButton",
      "label": "登录",
      "labelProcessing": "正在处理...",
      "formId": "linkForm",
      "actions": {
        "submit": "login"
      }
    },
    "linkNoEmailSubmit": {
      "type": "submitButton",
      "label": "登录",
      "labelProcessing": "正在处理...",
      "formId": "linkNoEmailForm",
      "actions": {
        "submit": "login"
      }
    },
    "linkForm": {
      "id": "linkForm",
      "type": "form"
    },
    "linkNoEmailForm": {
      "id": "linkNoEmailForm",
      "type": "form"
    },
    "linkAcknowledge": {
      "id": "linkAcknowledge",
      "classes": [],
      "dataField": "linkAcknowledge",
      "type": "checkbox",
      "label": "我知晓，通过连接我的帐号，Nike 将可访问我在 Facebook 上的基本信息，并且我将能在 Facebook 上分享我的 Nike 活动",
      "value": false,
      "active": true,
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "",
          "events": [
            "change",
            "submit"
          ]
        }
      ]
    },
    "joinHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>注册成为NIKE+会员</h1><h2 id=\"joinMessage\" class=\"nike-unite-message\">Nike 随时为你服务，助你选购卓越装备，为你提供专业指导、非凡体验和无限动力。</h2></header>"
    },
    "reauthHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>请再次输入密码</h1><h2>请输入 Nike 密码，以访问此安全体验。</h2></header>"
    },
    "keepMeLoggedIn": {
      "dataField": "keepMeLoggedIn",
      "id": "keepMeLoggedIn",
      "label": "保持登录状态",
      "rules": [],
      "tip": "",
      "type": "keepMeLoggedIn",
      "value": true
    },
    "socialJoinSubheader": {
      "type": "block",
      "value": "<h2 id=\"socialMessage\" class=\"nike-unite-message\">请填妥下列注册表。<br/><span class=\"nike-unite-submessage\">已有 Nike 帐户？ {{socialLoginLink label=\"登录\"}} 以关联您的帐户。</span></h2>"
    },
    "joinTerms": {
      "type": "block",
      "value": "<p class=\"terms\">一旦创建帐户，即表明你同意 Nike 的 <a {{policyLink}}>隐私政策</a> 和 <a {{termsLink}}>使用条款</a></a></p>"
    },
    "loginTerms": {
      "type": "block",
      "value": "<p class=\"terms\">一旦登录，即表明你同意 Nike 的 <a {{policyLink}}>隐私政策</a> 和 <a {{termsLink}}>使用条款</a></a></p>"
    },
    "policyLink": {
      "type": "block",
      "value": "href=\"javascript:void(0)\" onclick=\"javascript:nike.unite.openLegalLink('policyLink'); var obj = new Object(); obj.innerHTML = this.innerHTML; nike.unite.on.login.footerLink.fire(obj); return false;\""
    },
    "termsLink": {
      "type": "block",
      "value": "href=\"javascript:void(0)\" onclick=\"javascript:nike.unite.openLegalLink('termsLink'); var obj = new Object(); obj.innerHTML = this.innerHTML; nike.unite.on.login.footerLink.fire(obj); return false;\""
    },
    "joinForm": {
      "id": "joinForm",
      "type": "form",
      "hiddenFields": {
        "registrationSiteId": "nikedotcom"
      }
    },
    "firstName": {
      "dataField": "firstName",
      "focus": false,
      "type": "textInput",
      "value": "",
      "tip": "请输入有效的名字。",
      "placeholder": "名字",
      "label": "名字",
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的名字。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 40
          },
          "errorMessage": "名字不能超过 {max} 个字符。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ],
          "variables": {
            "max": 40
          }
        },
        {
          "name": "notMatchPattern",
          "value": {
            "pattern": "@"
          },
          "errorMessage": "请输入有效的名字。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string",
            "number",
            "boolean"
          ],
          "errorMessage": "请输入有效的名字。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "lastName": {
      "dataField": "lastName",
      "type": "textInput",
      "value": "",
      "tip": "请输入有效的姓氏。",
      "placeholder": "姓氏",
      "label": "姓氏",
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的姓氏。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 40
          },
          "errorMessage": "姓氏不能超过 {max} 个字符。",
          "variables": {
            "max": 40
          },
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "notMatchPattern",
          "value": {
            "pattern": "@"
          },
          "errorMessage": "请输入有效的姓氏。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string",
            "number",
            "boolean"
          ],
          "errorMessage": "请输入有效的姓氏。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "mobileNumber": {
      "dataField": "mobileNumber",
      "type": "textInput",
      "value": "",
      "tip": "请输入有效的手机号码",
      "placeholder": "手机号码",
      "label": "手机号码",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的手机号码",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 20
          },
          "errorMessage": "请输入有效的手机号码。",
          "variables": {
            "max": 20
          },
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "required": false,
            "pattern": "^1[0-9]{10}$"
          },
          "errorMessage": "请输入有效的手机号码",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "dateOfBirth": {
      "dataField": "dateOfBirth",
      "type": "dateOfBirth",
      "label": "出生日期",
      "tip": "请输入有效的出生日期。",
      "monthLabel": "月",
      "dayLabel": "天",
      "yearLabel": "年",
      "ddLabel": "日日",
      "mmLabel": "月月",
      "yyyyLabel": "年年年年",
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的出生日期。",
          "events": [
            "validation-createUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "active": true,
          "name": "matchPattern",
          "value": {
            "pattern": "^(19|20)\\d\\d[- \\.](0[1-9]|1[012])[- \\.](0[1-9]|[12][0-9]|3[01])$"
          },
          "errorMessage": "请输入有效的出生日期。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "active": true,
          "name": "matchPattern",
          "value": {
            "pattern": "^(((19|20)\\d\\d[- \\.](0[1-9]|1[012])[- \\.](0[1-9]|[12][0-9]|3[01]))|(^-?[0-9]+))$"
          },
          "errorMessage": "请输入有效的出生日期。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "active": true,
          "name": "dateInPast",
          "errorMessage": "请输入有效的出生日期。",
          "events": [
            "blur",
            "change",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string",
            "number"
          ],
          "errorMessage": "请输入有效的出生日期。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "active": true,
          "name": "crossField",
          "lookup": "context.v1.location.country",
          "type": "coppaCompliance",
          "errorMessage": "很抱歉，您没有资格访问本网站。 如有任何问题或疑虑，请联系客户支持。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "gender": {
      "dataField": "gender",
      "type": "genderButtons",
      "label": "性别",
      "tip": "请选择性别。 ",
      "options": [
        {
          "value": "male",
          "label": "男"
        },
        {
          "value": "female",
          "label": "女"
        }
      ],
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请选择性别。 ",
          "events": [
            "blur",
            "change",
            "click",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string",
            "number",
            "boolean"
          ],
          "errorMessage": "所输入的值无效。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "resetPasswordUsername": {
      "dataField": "emailAddress",
      "type": "textInput",
      "keyboardType": "email",
      "label": "电子邮件",
      "focus": true,
      "tip": "请输入有效的邮箱地址。",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 255
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "['_A-Za-z0-9-&\\+]+(\\.['_A-Za-z0-9-&\\+]+)*[.]{0,1}@([A-Za-z0-9-])+(\\.[A-Za-z0-9-]+)*((\\.[A-Za-z0-9]{2,})|(\\.[A-Za-z0-9]{2,}\\.[A-Za-z0-9]{2,}))"
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        }
      ]
    },
    "emailAddress": {
      "dataField": "emailAddress",
      "type": "textInput",
      "keyboardType": "email",
      "label": "电子邮件",
      "focus": false,
      "tip": "请输入有效的邮箱地址。",
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 255
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "^[-a-zA-Z0-9~!$%^&*_=+}{\\'?]+(\\.[-a-zA-Z0-9~!$%^&*_=+}{\\'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\\.[-a-zA-Z0-9_]+)*\\.([a-zA-Z0-9]+)|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}))(:[0-9]{1,5})?$"
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$"
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string"
          ],
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "reauthEmailAddress": {
      "dataField": "emailAddress",
      "type": "reauthEmailAddress",
      "label": "电子邮件",
      "key": "emailAddress",
      "disabled": true
    },
    "emailAddressDisabled": {
      "dataField": "emailAddress",
      "type": "textInput",
      "label": "电子邮件",
      "key": "emailAddress",
      "disabled": true
    },
    "password": {
      "dataField": "password",
      "type": "passwordInput",
      "label": "密码",
      "tip": "请输入密码。",
      "rules": [
        {
          "active": true,
          "name": "required",
          "value": true,
          "errorMessage": "请输入密码。",
          "events": [
            "blur",
            "submit"
          ]
        }
      ]
    },
    "country": {
      "hidden": false,
      "dataField": "country",
      "type": "country",
      "supportedList": {
        "AD": "安道尔",
        "AE": "阿拉伯联合酋长国",
        "AF": "阿富汗",
        "AG": "安提瓜和巴布达",
        "AI": "安圭拉岛",
        "AL": "阿尔巴尼亚",
        "AM": "亚美尼亚",
        "AN": "荷属安的列斯",
        "AO": "安哥拉",
        "AQ": "南极洲",
        "AR": "阿根廷",
        "AS": "美属萨摩亚",
        "AT": "奥地利",
        "AU": "澳大利亚",
        "AW": "阿鲁巴",
        "AZ": "阿塞拜疆",
        "BA": "波斯尼亚和黑塞哥维那",
        "BB": "巴巴多斯",
        "BD": "孟加拉国",
        "BE": "比利时",
        "BF": "布基纳法索",
        "BG": "保加利亚",
        "BH": "巴林岛",
        "BI": "布隆迪",
        "BJ": "贝宁",
        "BM": "百慕大群岛",
        "BN": "文莱达鲁萨兰国",
        "BO": "玻利维亚",
        "BR": "巴西",
        "BS": "巴哈马群岛",
        "BT": "不丹",
        "BV": "布维岛",
        "BW": "博茨瓦纳",
        "BY": "白俄罗斯",
        "BZ": "伯利兹",
        "CA": "加拿大",
        "CC": "科科斯（基林）群岛",
        "CD": "刚果（金）",
        "CF": "中非共和国",
        "CG": "刚果",
        "CH": "瑞士",
        "CI": "科特迪瓦",
        "CK": "库克群岛",
        "CL": "智利",
        "CM": "喀麦隆",
        "CN": "中国",
        "CO": "哥伦比亚",
        "CR": "哥斯达黎加",
        "CU": "古巴",
        "CV": "佛得角",
        "CX": "圣诞岛",
        "CY": "塞浦路斯",
        "CZ": "捷克共和国",
        "DE": "德国",
        "DJ": "吉布提",
        "DK": "丹麦",
        "DM": "多米尼加",
        "DO": "多米尼加共和国",
        "DZ": "阿尔及利亚",
        "EC": "厄瓜多尔",
        "EE": "爱沙尼亚",
        "EG": "埃及",
        "EH": "西撒哈拉",
        "ER": "厄立特里亚",
        "ES": "西班牙",
        "ET": "埃塞俄比亚",
        "EU": "欧盟",
        "FI": "芬兰",
        "FJ": "斐济",
        "FK": "福克兰群岛（马尔维纳斯）",
        "FM": "密克罗尼西亚联邦",
        "FO": "法罗群岛",
        "FR": "法国",
        "GA": "加蓬",
        "GB": "英国",
        "GD": "格林纳达",
        "GE": "格鲁吉亚",
        "GF": "法属圭亚那",
        "GH": "加纳",
        "GI": "直布罗陀",
        "GL": "格陵兰",
        "GM": "冈比亚",
        "GN": "几内亚",
        "GP": "瓜德罗普岛",
        "GQ": "赤道几内亚",
        "GR": "希腊",
        "GS": "南乔治亚和南桑威奇群岛",
        "GT": "危地马拉",
        "GU": "关岛",
        "GW": "几内亚比绍",
        "GY": "圭亚那",
        "HK": "香港",
        "HM": "赫德岛和麦克唐纳群岛",
        "HN": "洪都拉斯",
        "HR": "克罗地亚（当地名称：赫尔瓦次卡）",
        "HT": "海地",
        "HU": "匈牙利",
        "ID": "印度尼西亚",
        "IE": "爱尔兰",
        "IL": "以色列",
        "IN": "印度",
        "IO": "英属印度洋领地",
        "IQ": "伊拉克",
        "IR": "伊朗伊斯兰共和国",
        "IS": "冰岛",
        "IT": "意大利",
        "JM": "牙买加",
        "JO": "约旦",
        "JP": "日本",
        "KE": "肯尼亚",
        "KG": "吉尔吉斯斯坦",
        "KH": "柬埔寨",
        "KI": "基里巴斯",
        "KM": "科摩罗",
        "KN": "圣基茨和尼维斯",
        "KP": "朝鲜",
        "KR": "韩国",
        "KW": "科威特",
        "KY": "开曼群岛",
        "KZ": "哈萨克斯坦",
        "LA": "老挝",
        "LB": "黎巴嫩",
        "LC": "圣卢西亚岛",
        "LI": "列支敦土登",
        "LK": "斯里兰卡",
        "LR": "利比里亚",
        "LS": "莱索托",
        "LT": "立陶宛",
        "LU": "卢森堡",
        "LV": "拉脱维亚",
        "LY": "阿拉伯利比亚民众国",
        "MA": "摩洛哥",
        "MC": "摩纳哥",
        "MD": "摩尔多瓦共和国",
        "ME": "黑山",
        "MG": "马达加斯加岛",
        "MH": "马绍尔群岛",
        "MK": "马其顿",
        "ML": "马里",
        "MM": "缅甸",
        "MN": "蒙古",
        "MO": "澳门",
        "MP": "北马里亚纳群岛",
        "MQ": "马提尼克",
        "MR": "毛利塔尼亚",
        "MS": "蒙特塞拉特",
        "MT": "马耳他",
        "MU": "毛里求斯",
        "MV": "马尔代夫",
        "MW": "马拉维",
        "MX": "墨西哥",
        "MY": "马来西亚",
        "MZ": "莫桑比克",
        "NA": "纳米比亚",
        "NC": "新喀里多尼亚",
        "NE": "尼日尔",
        "NF": "诺福克岛",
        "NG": "尼日利亚",
        "NI": "尼加拉瓜",
        "NL": "荷兰",
        "NO": "挪威",
        "NP": "尼泊尔",
        "NR": "瑙鲁",
        "NU": "纽埃岛",
        "NZ": "新西兰",
        "OM": "阿曼",
        "PA": "巴拿马",
        "PE": "秘鲁",
        "PF": "法属玻利尼西亚",
        "PG": "巴布亚新几内亚",
        "PH": "菲律宾",
        "PK": "巴基斯坦",
        "PL": "波兰",
        "PM": "圣皮埃尔和密克隆群岛",
        "PN": "皮特凯恩",
        "PR": "波多黎各",
        "PT": "葡萄牙",
        "PW": "帕劳群岛",
        "PY": "巴拉圭",
        "QA": "卡塔尔",
        "RE": "留尼旺",
        "RO": "罗马尼亚",
        "RS": "塞尔维亚",
        "RU": "俄罗斯联邦",
        "RW": "卢旺达",
        "SA": "沙特阿拉伯",
        "SB": "所罗门群岛",
        "SC": "塞舌尔",
        "SD": "苏丹",
        "SE": "瑞典",
        "SG": "新加坡",
        "SH": "圣赫勒拿",
        "SI": "斯洛文尼亚",
        "SJ": "斯瓦尔巴特和扬马延岛",
        "SK": "斯洛伐克（斯洛伐克共和国）",
        "SL": "塞拉利昂",
        "SM": "圣马力诺",
        "SN": "塞内加尔",
        "SO": "索马里",
        "SR": "苏里南",
        "SS": "苏丹南部",
        "ST": "圣多美和普林西比",
        "SV": "萨尔瓦多",
        "SY": "阿拉伯叙利亚共和国",
        "SZ": "斯威士兰",
        "TC": "特克斯和凯科斯群岛",
        "TD": "乍得",
        "TF": "法属南半球领地",
        "TG": "多哥",
        "TH": "泰国",
        "TJ": "塔吉克斯坦",
        "TK": "托克劳",
        "TL": "东帝汶",
        "TM": "土库曼斯坦",
        "TN": "突尼斯",
        "TO": "汤加",
        "TR": "土耳其",
        "TT": "特立尼达和多巴哥",
        "TV": "图瓦卢",
        "TW": "中国台湾",
        "TZ": "坦桑尼亚联合共和国",
        "UA": "乌克兰",
        "UG": "乌干达",
        "UM": "美国小岛屿",
        "US": "美国",
        "UY": "乌拉圭",
        "UZ": "乌兹别克斯坦",
        "VA": "教廷（梵蒂冈）",
        "VC": "圣文森特和格林纳丁斯",
        "VE": "委内瑞拉",
        "VG": "英属维尔京群岛",
        "VI": "美属维尔京群岛",
        "VN": "越南",
        "VU": "瓦努阿图",
        "WF": "瓦利斯群岛和富图纳群岛",
        "WS": "萨摩亚",
        "XX": "Unknown Country",
        "YE": "也门",
        "YT": "马约特岛",
        "ZA": "南非",
        "ZM": "赞比亚",
        "ZW": "津巴布韦"
      },
      "label": "国家/地区",
      "tip": "请选择国家。",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请选择国家。",
          "events": [
            "blur",
            "submit",
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "unsupported",
          "errorMessage": "不得删除该字段。",
          "events": [
            "validation-deleteUserField"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 40
          },
          "errorMessage": "请输入有效的国家代码。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "^(AD|AE|AF|AG|AI|AL|AM|AN|AO|AQ|AR|AS|AT|AU|AW|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|EH|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GH|GI|GL|GM|GN|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IN|IO|IQ|IR|IS|IT|JM|JO|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MK|ML|MM|MN|MO|MP|MQ|MR|MS|MT|MU|MV|MW|MX|MY|MZ|NA|NC|NE|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|SS|ST|SV|SY|SZ|TC|TD|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|UM|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XX|YE|YT|ZA|ZM|ZW)$"
          },
          "errorMessage": "请输入有效的国家代码。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        },
        {
          "name": "isOfType",
          "value": [
            "string"
          ],
          "errorMessage": "请输入有效的国家代码。",
          "events": [
            "validation-createUser",
            "validation-updateUser"
          ]
        }
      ]
    },
    "passwordCreate": {
      "dataField": "passwordCreate",
      "type": "passwordCreateInput",
      "label": "密码",
      "showLabel": "显示",
      "hideLabel": "隐藏",
      "tip": "请输入密码。",
      "labels": {
        "charLength": "最少 8 个字符",
        "upperCase": "1 个大写字母",
        "lowerCase": "1 个小写字母",
        "number": "1 个数字"
      },
      "lookups": {
        "screenName": "function (target) { if (target.form.screenName) { return target.form.screenName.value; }; return '';",
        "emailAddress": "function (target) { if (target.form.emailAddress) { return target.form.emailAddress.value; }; return '';"
      },
      "rulesOptions": {
        "validateAll": true,
        "force": false
      },
      "rules": [
        {
          "name": "crossField",
          "lookup": "screenName",
          "type": "notequal",
          "keys": [
            "screenName"
          ],
          "errorMessage": "不能与昵称相同",
          "events": [
            "blur",
            "keyup",
            "submit"
          ]
        },
        {
          "name": "crossField",
          "lookup": "emailAddress",
          "type": "notequal",
          "keys": [
            "email"
          ],
          "errorMessage": "密码不能与您的电子邮件地址相同",
          "events": [
            "blur",
            "keyup",
            "submit"
          ]
        },
        {
          "name": "crossField",
          "lookup": "core.v1.screenname",
          "softFail": true,
          "type": "notequal",
          "errorMessage": "不能与昵称相同",
          "events": [
            "validation-createUser"
          ]
        },
        {
          "name": "crossField",
          "lookup": "core.v1.username",
          "softFail": true,
          "type": "notequal",
          "errorMessage": "密码不能与您的电子邮件地址相同",
          "events": [
            "validation-createUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "[0-9]"
          },
          "keys": [
            "number"
          ],
          "errorMessage": "密码不符合最低安全要求。 ",
          "events": [
            "blur",
            "keyup",
            "submit",
            "validation-createUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "[a-z]"
          },
          "keys": [
            "lowerCase"
          ],
          "errorMessage": "密码不符合最低安全要求。 ",
          "events": [
            "blur",
            "keyup",
            "submit",
            "validation-createUser"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "[A-Z]"
          },
          "keys": [
            "upperCase"
          ],
          "errorMessage": "密码不符合最低安全要求。 ",
          "events": [
            "blur",
            "keyup",
            "submit",
            "validation-createUser"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 8,
            "max": 36
          },
          "keys": [
            "charLength"
          ],
          "errorMessage": "密码不符合最低安全要求。 ",
          "events": [
            "blur",
            "keyup",
            "submit",
            "validation-createUser"
          ]
        },
        {
          "name": "required",
          "softFail": true,
          "value": true,
          "errorMessage": "密码不符合最低安全要求。 ",
          "events": [
            "validation-createUser"
          ]
        },
        {
          "name": "unsupported",
          "softFail": true,
          "errorMessage": "暂不支持更新此字段",
          "value": true,
          "events": [
            "validation-updateUser",
            "validation-deleteUserField"
          ]
        }
      ]
    },
    "emailSignup": {
      "dataField": "receiveEmail",
      "type": "checkbox",
      "label": "注册接收电子邮件，掌握所有 Nike 最新动态。",
      "tip": "",
      "rules": [],
      "value": true
    },
    "joinSubmit": {
      "type": "submitButton",
      "label": "注册",
      "labelProcessing": "正在处理...",
      "formId": "joinForm",
      "actions": {
        "submit": "join"
      }
    },
    "socialJoinSubmit": {
      "type": "submitButton",
      "label": "注册",
      "labelProcessing": "正在处理...",
      "formId": "joinForm",
      "actions": {
        "submit": "join"
      }
    },
    "loginHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>注册成为NIKE+会员</h1></header>"
    },
    "loginContinuityHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}</header>"
    },
    "loginForm": {
      "id": "loginForm",
      "type": "form",
      "hiddenFields": {
        "registrationSiteId": "nikedotcom"
      }
    },
    "progressiveHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>验证您的手机号码</h1><h2>为增强安全性，我们需要通过短信向您发送一条一次性的验证码，以确保我们的商品顺利抵达顾客手中。</h2></header>"
    },
    "progressiveForm": {
      "id": "progressiveForm",
      "type": "form"
    },
    "loginDropdownForm": {
      "id": "loginDropdownForm",
      "type": "form"
    },
    "loginUsername": {
      "dataField": "emailAddress",
      "type": "textInput",
      "keyboardType": "email",
      "focus": true,
      "label": "电子邮件",
      "tip": "请输入有效的邮箱地址。",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "stringLength",
          "value": {
            "min": 0,
            "max": 255
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "matchPattern",
          "value": {
            "pattern": "['_A-Za-z0-9-&\\+]+(\\.['_A-Za-z0-9-&\\+]+)*[.]{0,1}@([A-Za-z0-9-])+(\\.[A-Za-z0-9-]+)*((\\.[A-Za-z0-9]{2,})|(\\.[A-Za-z0-9]{2,}\\.[A-Za-z0-9]{2,}))"
          },
          "errorMessage": "请输入有效的邮箱地址。",
          "events": [
            "blur",
            "submit"
          ]
        }
      ]
    },
    "socialLogin": {
      "type": "socialLinks",
      "value": "",
      "label": "或使用帐户登录：",
      "conjunction": "或者",
      "conjunctionPosition": "top",
      "mobile": false
    },
    "loginOptions": {
      "type": "block",
      "value": "<div class=\"nike-unite-login-options\">{{rememberMe}}{{forgotPassword}}</div>"
    },
    "rememberMe": {
      "key": "rememberMe",
      "type": "hidden",
      "value": "false",
      "label": "记住我",
      "rules": []
    },
    "loginSubmit": {
      "type": "submitButton",
      "label": "登录",
      "labelProcessing": "正在处理...",
      "formId": "loginForm",
      "actions": {
        "submit": "login"
      }
    },
    "loginContinuityDialog": {
      "type": "loginContinuityDialog",
      "continueText": "继续作为 {{userFirstName}} 登录",
      "notMeText": "不使用 {{userFirstName}} 的帐号登录？",
      "joinTerms": "<p class=\"terms\">一旦创建帐户，即表明你同意 Nike 的 <a {{policyLink}}>隐私政策</a> 和 <a {{termsLink}}>使用条款</a></a></p>"
    },
    "updatePasswordBlock": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>更新密码</h1><h2>请输入您的新密码。</h2></header>"
    },
    "forgotPasswordBlock": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>重置密码</h1><h2>输入您的电子邮件地址，我们将通过电子邮件给您发送密码重置说明。</h2></header>"
    },
    "forgotPassword": {
      "type": "viewLink",
      "label": "忘记密码？",
      "view": "resetPassword"
    },
    "forgotPasswordForm": {
      "type": "form",
      "id": "forgotPasswordForm"
    },
    "forgotPasswordSubmit": {
      "type": "submitButton",
      "label": "重置",
      "labelProcessing": "正在处理...",
      "formId": "forgotPasswordForm",
      "actions": {
        "submit": "resetPassword"
      }
    },
    "confirmPasswordResetBlock": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>密码重置</h1><p>我们已将密码重置说明发送至您的电子邮箱。 请检查您的收件箱并点击邮件所含链接。</p></header>"
    },
    "verifyCodeHeader": {
      "type": "block",
      "value": "<header>{{nikeSwoosh}}<h1>输入您的验证码</h1><h2>不要离开此页。 重新获取我们最近通过短信向您发送的六位验证码。</h2></header>"
    },
    "verifyCodeForm": {
      "type": "form",
      "id": "verifyCodeForm"
    },
    "verifyCodeSubmit": {
      "type": "submitButton",
      "labelProcessing": "正在处理...",
      "label": "提交",
      "formId": "verifyCodeForm",
      "actions": {
        "submit": "verifyCode"
      }
    },
    "verifyMobileNumber": {
      "dataField": "phone",
      "type": "textInput",
      "keyboardType": "tel",
      "value": "",
      "tip": "请输入有效的手机号码",
      "placeholder": "手机号码",
      "label": "手机号码",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的手机号码",
          "events": [
            "blur",
            "submit"
          ]
        },
        {
          "name": "isPhoneNumber",
          "errorMessage": "请输入有效的手机号码",
          "events": [
            "blur",
            "submit"
          ]
        }
      ]
    },
    "code": {
      "dataField": "code",
      "type": "textInput",
      "keyboardType": "number",
      "tip": "请输入有效的验证码",
      "value": "",
      "placeholder": "输入验证码",
      "label": "输入验证码",
      "rules": [
        {
          "name": "required",
          "value": true,
          "errorMessage": "请输入有效的验证码",
          "events": [
            "blur",
            "submit"
          ]
        }
      ]
    },
    "sendCodeSubmit": {
      "type": "submitButton",
      "label": "发送验证码",
      "labelProcessing": "正在处理...",
      "formId": "progressiveForm",
      "actions": {
        "submit": "sendCode"
      }
    },
    "currentMemberSignIn": {
      "type": "actionLink",
      "classes": [
        "nike-unite-component",
        "action-link",
        "current-member-signin"
      ],
      "label": "已经是会员？",
      "view": "login",
      "linkText": "立即登录"
    },
    "nikeSwoosh": {
      "type": "block",
      "value": "<div class=\"nike-unite-swoosh\"></div>"
    }
  }
});