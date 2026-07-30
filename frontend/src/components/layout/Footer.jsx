export default function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Copyright &copy; {new Date().getFullYear()} SEPREV &middot; AL — Secretaria de Estado de Prevenção à Violência de Alagoas. Todos os direitos reservados.
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
        Desenvolvido por Victor Seixas &bull;{' '}
        <a href="mailto:victorseixasmcz@gmail.com" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          victorseixasmcz@gmail.com
        </a>
      </p>
    </footer>
  )
}
