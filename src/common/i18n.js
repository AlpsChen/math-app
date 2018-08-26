import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import Expo from 'expo';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    return /*'en'; */ Expo.DangerZone.Localization.getCurrentLocaleAsync().then(
      lng => {
        callback(lng.replace('_', '-'));
      }
    );
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    resources: {
      zh: {
        onboardingPage: {
          welcome: {
            title: '歡迎',
            description: '這裡有五花八門的數學題供你小試身手'
          },
          mode: {
            title: '五種模式',
            description: '適性、隨機、簡單、中等、困難'
          },
          paper: {
            title: '計算紙',
            description: '隨時隨地都能算'
          },
          limit: {
            title: '時限',
            description: '讓答題更具挑戰性'
          },
          review: {
            title: '複習',
            description: '標記難題，加強印象'
          },
          sound: {
            title: '音效',
            description: '開啟聲音，讓答題更有趣'
          },
          update: {
            title: '隨時更新',
            description: '最新題型，一應俱全'
          },
          success: {
            title: '數學起飛',
            description: '會考成為囊中物！'
          }
        },
        accountPage: {
          name: '暱稱',
          email: '電子郵件',
          password: '密碼',
          confirmPassword: '確認密碼',
          login: '登入',
          signUp: '註冊',
          errors: {
            email: '請輸入有效電子郵件',
            password: '密碼長度需至少為8字元',
            confirmPassword: '兩密碼不相同',
            emailInUse: '帳號已在別處被使用',
            network: '請檢查網路連線',
            signUpFailed: '註冊失敗',
            loginFailed: '登入失敗',
            incorrect: '帳號或密碼錯誤',
            notFound: '帳號不存在'
          }
        },
        welcomePage: {
          welcome: ',歡迎',
          start: '開始練習',
          setting: '設定',
          logOut: '登出',
          timeLimitMode: '時限模式',
          confirm: '確定',
          questions: '題',
          network: '請檢查網路連線'
        },
        settingsPage: {
          modeDescriptions: [
            '題目難度將適性調整。當你答對簡單題，題目將會越來越難，但若你答錯，題目又會變回簡單',
            '題目難度將為隨機',
            '題目難度全為簡單',
            '題目難度全為中等',
            '題目難度全為困難'
          ],
          limitDescriptions: [
            '簡單題時限5分鐘，中等題時限8分鐘，困難題時限10分鐘',
            '簡單題時限2分鐘，中等題時限5分鐘，困難題時限8分鐘',
            '簡單題時限1分鐘，中等題時限2分鐘，困難題時限5分鐘'
          ],
          total: '題數：',
          sound: {
            on: '開啟音效，獲得更佳體驗',
            off: '關閉音效，思考不受影響'
          }
        },
        questionPage: {
          header: {
            title: '題目：{{current}}/{{total}}',
            left: {
              title: '你確定要離開嗎',
              message: '記錄將不會被儲存',
              yes: '確定',
              no: '不要啊',
              leave: '離開'
            },
            right: {
              difficulty: '難度：'
            }
          },
          timeUp: {
            title: '時間到',
            message: '是否標記本題',
            yes: '是',
            no: '否'
          }
        },
        scoringPage: {
          buttons: {
            viewMarked: '查看難題',
            goBack: '回到首頁'
          },
          alert: {
            title: '你沒有標記難題哦',
            ok: '了解',
            ok2: '下次會記得'
          }
        },
        reviewPage: {
          user: {
            show: '你的答案',
            hide: '隱藏答案'
          },
          correct: {
            show: '正確答案',
            hide: '隱藏答案'
          }
        },
        common: {
          modes: ['適性模式', '隨機模式', '簡單模式', '中等模式', '困難模式']
        }
      },
      en: {
        onboardingPage: {
          welcome: {
            title: 'WELCOME',
            description:
              'We got miscellaneous math problems for you to practice.'
          },
          mode: {
            title: 'FIVE MODES',
            description: 'Adapt, Random, Easy, Medium, and Hard.'
          },
          paper: {
            title: 'VIRTUAL SCRATCH PAPER',
            description: 'Calculate anywhere, anytime.'
          },
          limit: {
            title: 'TIME LIMIT',
            description: 'Race the time, challenge the limit.'
          },
          review: {
            title: 'REVIEW',
            description: 'Mark the difficult ones, deepen your impression.'
          },
          sound: {
            title: 'SOUND EFFECTS',
            description: 'Activate the cumbersome process of calculation.'
          },
          update: {
            title: 'CONSTANTLY RENEWS',
            description: 'Trending questions, all in one.'
          },
          success: {
            title: 'TAKE OFF',
            description: 'Your exams will be in the bag.'
          }
        },
        accountPage: {
          name: 'Name',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          login: 'LOGIN',
          signUp: 'SIGN UP',
          errors: {
            email: 'Please provide a valid email.',
            password: 'Password must be more than 7 characters',
            confirmPassword: "Passwords don't match.",
            emailInUse: 'The account has been used somewhere else.',
            network: 'Please check the internet connection.',
            signUpFailed: 'Sign up failed :(',
            loginFailed: 'Login failed :(',
            incorrect: 'Email or password incorrect.',
            notFound: "The account doesn't exist"
          }
        },
        welcomePage: {
          welcome: '¡Hola!',
          start: 'Practice',
          setting: 'Settings',
          logOut: 'Sign Out',
          timeLimitMode: 'Time Limit',
          confirm: 'GO',
          questions: ' Questions',
          network: 'Please check the internet connection.'
        },
        settingsPage: {
          modeDescriptions: [
            'The problem difficulty will be adapted. Answering a problem correct, you will be assigned to a harder one. Vice versa.',
            'The problem difficulty will be random.',
            'The problem difficulty will be easy.',
            'The problem difficulty will be medium.',
            'The problem difficulty will be hard.'
          ],
          limitDescriptions: [
            'Easy: 5 mins, Medium: 8 mins, Hard: 10 mins.',
            'Easy: 2 mins, Medium: 5 mins, Hard: 8 mins.',
            'Easy: 1 min, Medium: 2 mins, Hard: 5 mins.'
          ],
          total: 'Total Questions：',
          sound: {
            on: 'Turn on for an optimized experience.',
            off: 'Turn off for a concentrated practice.'
          }
        },
        questionPage: {
          header: {
            title: 'PROBLEM: {{current}}/{{total}}',
            left: {
              title: 'Sure to leave?',
              message: 'Your records will not be saved',
              yes: 'Sure',
              no: 'Wait',
              leave: 'EXIT'
            },
            right: {
              difficulty: 'DIFFICULTY: '
            }
          },
          timeUp: {
            title: "TIME'S UP",
            message: 'Do you want to mark this problem?',
            yes: 'OF COURSE',
            no: 'NO THANKS'
          }
        },
        scoringPage: {
          buttons: {
            viewMarked: 'REVIEW',
            goBack: 'HOME'
          },
          alert: {
            title: 'You did not mark any problems!',
            ok: 'I SEE',
            ok2: 'OOOOOPS'
          }
        },
        reviewPage: {
          user: {
            show: 'YOUR ANS',
            hide: 'HIDE ANS'
          },
          correct: {
            show: ' CORRECT',
            hide: 'HIDE ANS'
          }
        },
        common: {
          modes: [
            'Adapt Mode',
            'Random Mode',
            'Easy Mode',
            'Medium Mode',
            'Hard Mode'
          ]
        }
      }
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: true,

    // cache: {
    //   enabled: true
    // },

    interpolation: {
      escapeValue: false // not needed for react as it does escape per default to prevent xss!
    }
  });

export default i18n;
