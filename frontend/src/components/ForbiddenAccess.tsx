import Link from "next/link";
import React from "react";

interface ForbiddenAccessProps {
  title?: string;
  message?: string;
  supportEmail?: string;
}

export default function ForbiddenAccess({
  title = "Acceso Restringido",
  message = "Lo sentimos, no tienes los permisos necesarios para acceder a este recurso. Si crees que esto es un error, contacta a tu administrador.",
  supportEmail = "soporte@tuempresa.com",
}: ForbiddenAccessProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0B0E14] relative overflow-hidden font-sans transition-colors duration-300">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white dark:bg-[#151921] border border-gray-200 dark:border-[#2D333D] shadow-2xl rounded-2xl p-8 md:p-12 text-center relative overflow-hidden transition-colors duration-300">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-500/20 shadow-lg shadow-red-500/5 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <p className="text-red-500 font-bold tracking-widest uppercase text-xs mb-2">
            Error 403
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            
            <Link
              href="/"
              className="group w-full inline-flex justify-center items-center px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-offset-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Dashboard
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`mailto:${supportEmail}`}
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                Contactar Soporte
              </a>
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-transparent border border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Cambiar cuenta
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <p className="text-xs text-gray-400 font-mono">
              ID de solicitud: <span className="select-all cursor-text text-gray-500 dark:text-gray-500">req_{Math.random().toString(36).substring(7)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}