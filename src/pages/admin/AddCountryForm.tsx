import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AddCountryForm = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleAdd = async () => {
    await supabase.from('countries').insert([{ name, code, flag_emoji: emoji }]);
    alert('New country added!');
  };

  return (
    <div>
      <h3>Add New Country</h3>
      <input placeholder="Spain" onChange={e => setName(e.target.value)} />
      <input placeholder="es" onChange={e => setCode(e.target.value)} />
      <input placeholder="🇪🇸" onChange={e => setEmoji(e.target.value)} />
      <button onClick={handleAdd}>Add Country</button>
    </div>
  );
};

export default AddCountryForm;
