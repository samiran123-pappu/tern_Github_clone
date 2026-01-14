
const SortRepos = ({ sortType, onSort }) => {
    const BUTTONS = [
        { label: "Most Recent", value: "recent" },
        { label: "Most Stars", value: "stars" },
        { label: "Most Forks", value: "forks" },
    ]

    return (
        <div className="mb-2 flex justify-center lg:justify-end">
            {BUTTONS.map((button) => (
                <button
                    key={button.value}
                    type='button'
                    className={`py-2.5 px-5 me-2 mb-2 text-xs sm:text-sm font-medium focus:outline-none rounded-lg bg-glass ${button.value == sortType ? "border-blue-500" : ""
                        }`}
                    onClick={() => onSort(button.value)}
                >
                    {button.label}
                </button>
            ))}

        </div>
    )
}

export default SortRepos