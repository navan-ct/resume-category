import GithubLogo from './icons/github'

const Navbar = () => (
  <nav className="px-10 pt-5">
    <h1 className="flex items-center gap-x-1.5">
      <GithubLogo
        className="h-5 w-5"
        pathClassName="fill-slate-950"
        viewBox="0 0 100 100"
      />
      <a
        className="text-xl font-bold"
        href="https://github.com/nvneeth/resume-category"
        target="_blank"
      >
        resume-category
      </a>
    </h1>
  </nav>
)

export default Navbar
