import MembersEditorPage from '@/pages/MembersEditorPage'
import AuthCallBack from '@/pages/PostAuthPage'
import MatchConfigurationPage from '@/pages/MatchConfigurationPage'
import ChooseCaptainsPage from '@/pages/ChooseCaptainsPage'

export default {
  mode: 'history',
  routes: [
    {
      path: '/membersEditor',
      name: 'MembersEditorPage',
      component: MembersEditorPage
    },
    {
      path: '/',
      name: 'MatchConfigurationPage',
      component: MatchConfigurationPage
    },
    {
      path: '/ChooseCaptainsPage',
      name: 'ChooseCaptainsPage',
      component: ChooseCaptainsPage
    },

    {
      path: '/authcallback',
      name: 'authcallback',
      component: AuthCallBack,
      isAuthReturnURL: true
    }

  ]
}
