import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Charts',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Patient\'s Record',
        link: '/pages/charts/echart/',
      }
    ],
  },
  {
    title: 'Tables',
    icon: 'nb-tables',
    children: [
      {
        title: 'List Patients',
        link: '/pages/tables/patient-table',
      },
      {
        title: 'List Patient\'s Record',
        link: '/pages/tables/record-table',
        

      },
      {
        title: 'Desirable Levels',
        link: '/pages/tables/desirable-levels',
      },
    ],
  },
  {
    title: 'About',
    'icon': 'nb-paper-plane',
    children: [{
      title: 'This Project',
      link: '/pages/about/this-project'
    }]

  }
  /*
  {
    title: 'Auth',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
  */
];
