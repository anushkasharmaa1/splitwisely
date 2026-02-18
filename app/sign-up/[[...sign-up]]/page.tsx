import { SignUp } from '@clerk/nextjs'
import Navigation from '@/components/Navigation'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <SignUp />
      </div>
    </div>
  )
}
