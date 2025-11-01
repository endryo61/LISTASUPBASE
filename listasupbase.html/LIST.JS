const SUPABASE_URL = "https://uizhjnsizaoniohbjewv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpemhqbnNpemFvbmlvaGJqZXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUzNTksImV4cCI6MjA3NzU5MTM1OX0.DTIpLD9BnQN6ry5LmKJE_ZuLflnySB6olKHSFZ4Zn4c"; 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Carregar tarefas
async function carregar() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao carregar tarefas:", error.message);
    return;
  }

  const lista = document.getElementById('list');
  lista.innerHTML = '';

  data.forEach(i => {
    const item = document.createElement('li');
    item.innerHTML = `
      <span>${i.title} (${new Date(i.created_at).toLocaleDateString()}) ${i.is_complete ? '✅' : '⬜'}</span>
      <div class="actions">
        <button onclick="alternarStatus('${i.id}', ${i.is_complete})">✔</button>
        <button onclick="excluir('${i.id}')">🗑</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

async function alternarStatus(id, atual) {
  await supabase.from('todos').update({ is_complete: !atual }).eq('id', id);
  carregar();
}

async function excluir(id) {
  await supabase.from('todos').delete().eq('id', id);
  carregar();
}

// Adicionar tarefa
async function adicionar() {
  const title = document.getElementById('t').value.trim();
  const status = document.getElementById('status');
  if (!title) {
    status.textContent = "Digite uma tarefa válida.";
    return;
  }
  const { error } = await supabase.from('todos').insert({ title });
  if (error) {
    status.textContent = "Erro ao adicionar tarefa: " + error.message;
  } else {
    status.textContent = "Tarefa adicionada com sucesso!";
    document.getElementById('t').value = '';
    carregar();
  }
}

// Alternar status
async function alternarStatus(id, atual) {
  await supabase.from('todos').update({ is_complete: !atual }).eq('id', id);
  carregar();
}

// Excluir tarefa
async function excluir(id) {
  await supabase.from('todos').delete().eq('id', id);
  carregar();
}

// Inicializar
document.getElementById('add').onclick = adicionar;
carregar();
