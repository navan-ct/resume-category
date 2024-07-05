import GithubLogo from './icons/github'

const Navbar = () => (
  <nav className="mb-[1.125rem]">
    <h1 className="flex items-center gap-x-1.5">
      <GithubLogo
        className="h-[1.125rem] w-[1.125rem]"
        pathClassName="fill-neutral-700"
        viewBox="0 0 100 100"
      />
      <a
        className="text-xl font-bold text-neutral-700"
        href="https://github.com/nvneeth/resume-category"
        target="_blank"
      >
        resume-category
      </a>
    </h1>
  </nav>
)

export default Navbar
