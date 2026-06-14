import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Phone, X, AlertOctagon } from 'lucide-react'

export default function SOSButton() {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-danger rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 bg-danger rounded-full animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-danger-400 to-danger-600 rounded-full flex items-center justify-center shadow-xl shadow-danger/40 group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 bg-white text-danger text-xs font-bold px-2 py-0.5 rounded-full shadow-md border border-danger/20">
            SOS
          </span>
        </div>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-br from-danger-500 to-danger-600 p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <AlertOctagon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">紧急救援确认</h2>
              <p className="text-white/80 text-sm">确认需要紧急救援吗？</p>
            </div>

            <div className="p-6">
              <div className="bg-danger-50 rounded-2xl p-4 mb-6 border border-danger/10">
                <p className="text-sm text-danger-700 leading-relaxed">
                  点击确认后，救援团队将立即收到您的求救信号，并根据您的位置信息派遣救援人员前往。
                  请保持手机畅通，不要离开当前位置。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-secondary-200 text-secondary-600 font-medium hover:bg-secondary-50 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    取消
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false)
                    navigate('/visitor/sos')
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-danger-500 to-danger-600 text-white font-medium hover:from-danger-600 hover:to-danger-700 shadow-lg shadow-danger/30 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    确认呼救
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
