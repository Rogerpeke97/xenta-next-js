import type { NextPage } from 'next'
import TextLink from '../../components/atoms/links/TextLink'
import FormLogin from '../../components/molecules/forms/FormLogin'


const loginStyle = {
  height: '600px',
  minWidth: '320px',
  maxWidth: '800px',
  width: '100%'
}

const Login: NextPage = () => {

  return (
    <div className="flex h-full items-center justify-center">
      <div style={loginStyle} className="flex flex-col bg-background rounded-lg">
        <div className="py-7 flex items-center justify-center">
          <h1 className="heading-3 font-bold">Login</h1>
        </div>
        <div className="flex w-full py-3 px-3">
          <FormLogin />
        </div>
        <div className="flex w-full h-full items-end pt-4 px-3">
          <div className="flex w-full items-center justify-end py-4">
            <TextLink text="Continue as guest" link="/forgot-password" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
