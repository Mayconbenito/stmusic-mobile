import { useSelector } from 'react-redux';

export default function() {
  const player = useSelector(state => state.player);

  if (player.active) {
    return 57;
  }
  return 0;
}
