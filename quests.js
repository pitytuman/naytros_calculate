const csv = `location_name,npc_name,quest_name,image
Деребас,Волк,Химсвет,images/quests/derebas_quests_1_chem_light.png
Деребас,Волк,Говядина,images/quests/derebas_quests_1_beef.png
Деребас,Цербер,Патруль,images/quests/patrol.png
Нейтралы,Грок,Головы,images/quests/dog_heads.png`;

let idCounter = 0;
    
function buildStaticTree(data) {
  const tree = {};
  for (const { location_name, npc_name, quest_name, image } of data) {
    if (!tree[location_name]) tree[location_name] = {};
    if (!tree[location_name][npc_name]) tree[location_name][npc_name] = {};
    if (!tree[location_name][npc_name][quest_name]) tree[location_name][npc_name][quest_name] = [];
    tree[location_name][npc_name][quest_name].push(image);
  }
  return tree;
}

function renderLocations(tree) {
  return Object.entries(tree).map(([location, npcs]) => {
	const locId = `loc_${idCounter++}`;
	return `
	  <a class="collapse-toggle toggle-location" data-bs-toggle="collapse" href="#${locId}" role="button" aria-expanded="false">
        <div style="align: center;"> ${location} <span class="icon">▼</span></div>
      </a>
      <div class="collapse collapse-content" id="${locId}">
	    ${renderNpcs(npcs)}
	  </div>
    `;
  }).join('');
}

function renderNpcs(npcs) {
  return Object.entries(npcs).map(([npc, quests]) => {
    const npcId = `npc_${idCounter++}`;
    return `
	  <a class="collapse-toggle toggle-quester" data-bs-toggle="collapse" href="#${npcId}" role="button" aria-expanded="false">
        <div style="align: center;"> ${npc} <span class="icon">▼</span></div>
      </a>
      <div class="collapse collapse-content" id="${npcId}">
	    ${renderQuests(quests)}
	  </div>
    `;
  }).join('');
}

function renderQuests(quests) {
  return Object.entries(quests).map(([quest, images]) => {
	const questId = `quest_${idCounter++}`;
    return `
	  <a class="collapse-toggle" data-bs-toggle="collapse" href="#${questId}" role="button" aria-expanded="false">
        <div style="align: center;"> ${quest} <span class="icon">▼</span></div>
      </a>
      <div class="collapse collapse-content" id="${questId}">
	    ${images.map(img => `<img src="${img}" alt="${quest}" class="img-preview">`).join('')}
      </div>
    `;
  }).join('');
}

Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    const data = results.data;
    const nested = buildStaticTree(data);
    document.getElementById("quests").innerHTML = renderLocations(nested);
  }
});