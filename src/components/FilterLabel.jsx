let _css = {
    btn: 'bg-green-300 hover:bg-green-400 text-black pb-1 px-4 rounded ml-2 cursor-pointer ',
    btnSelected: 'bg-green-600 hover:bg-green-600 text-black pb-1 px-4 rounded ml-2',
  }

export function FilterLabel(props) {
  const { name, isSelected, handleSelect } = props;
  return (
    <button className={isSelected ? _css.btnSelected : _css.btn} onClick={handleSelect}>
      {name}
    </button>
  )
}
