<template>
  <div class="lottery-container">
    <!-- 页面标题区域 -->
    <header class="page-header">
      <h1 class="main-title">员工幸运抽奖</h1>
      <p class="subtitle">好运 好运连连 · 惊喜不断</p>
    </header>

    <!-- 抽奖控制面板 -->
    <div class="control-panel">
      <button class="settings-btn" @click="openSettingsModal" :disabled="isRunning">
        <i class="icon-cog"></i> 奖项设置
      </button>

      <div class="prize-selector">
        <label for="prizeType">当前奖项:</label>
        <select
          id="prizeType"
          v-model="selectedPrize"
          @change="handlePrizeChange"
          class="prize-select"
          :disabled="isRunning"
        >
          <option v-for="prize in prizeTypes" :key="prize.value" :value="prize.value">
            {{ prize.label }}: {{ prize.gift }} ({{ prize.count }}名)
          </option>
        </select>
      </div>

      <div class="action-buttons">
        <button class="btn reset-btn" @click="resetLottery" :disabled="isRunning">重置抽奖</button>
        <button
          class="btn start-btn"
          @click="toggleLottery"
          :disabled="remainingParticipants.length < selectedPrizeCount && !isRunning"
        >
          {{ isRunning ? '停止抽奖' : '开始抽奖' }}
        </button>
      </div>
    </div>

    <!-- 抽奖矩阵和结果区域（宽屏布局） -->
    <div class="main-content">
      <!-- 抽奖矩阵区域 -->
      <div class="lottery-grid-container">
        <h2 class="section-title">参与人员</h2>
        <div class="lottery-grid">
          <div
            v-for="(participant, index) in participants"
            :key="participant.id"
            :class="[
              'participant-card',
              isRunning ? 'shuffling' : '',
              isWinner(participant.id) ? 'winner' : '',
              hasDrawn(participant.id) ? 'drawn' : '',
              isRunning ? 'pulsing' : '',
            ]"
            :style="{ animationDelay: `${index * 0.02}s` }"
          >
            <div class="name">{{ participant.name }}</div>
            <div class="department">{{ participant.department }}</div>
            <div v-if="isWinner(participant.id)" class="winner-badge">中奖</div>
          </div>
        </div>
      </div>

      <!-- 中奖结果展示（调整宽度） -->
      <div class="results-section">
        <h2 class="section-title">中奖结果</h2>
        <div class="results-list">
          <div v-if="allWinners.length === 0" class="no-results">暂无中奖记录，开始抽奖吧！</div>
          <div v-for="winner in allWinners" :key="winner.id + winner.prize" class="winner-item">
            <div class="winner-info">
              <span class="winner-name">{{ winner.name }}</span>
              <span class="winner-department">{{ winner.department }}</span>
            </div>
            <div class="winner-prize" :class="`prize-${winner.prize}`">
              {{ getPrizeLabel(winner.prize) }}: {{ getPrizeGift(winner.prize) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 奖项设置弹窗 -->
    <teleport to="body">
      <div class="settings-modal" v-if="showSettingsModal" @click="closeSettingsModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>奖项设置</h3>
            <span class="close-btn" @click="closeSettingsModal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="prize-forms">
              <div v-for="(prize, index) in prizeTypes" :key="prize.value" class="prize-form">
                <div class="form-group">
                  <label>奖项等级</label>
                  <input
                    type="text"
                    v-model="prize.label"
                    placeholder="例如：一等奖"
                    class="form-control"
                    :disabled="isRunning"
                  />
                </div>
                <div class="form-group">
                  <label>奖品名称</label>
                  <input
                    type="text"
                    v-model="prize.gift"
                    placeholder="例如：98寸电视"
                    class="form-control"
                    :disabled="isRunning"
                  />
                </div>
                <div class="form-group">
                  <label>中奖人数</label>
                  <input
                    type="number"
                    v-model.number="prize.count"
                    min="1"
                    class="form-control"
                    :disabled="isRunning"
                  />
                </div>
                <div class="form-actions">
                  <button
                    class="btn delete-btn"
                    @click="removePrize(index)"
                    :disabled="prizeTypes.length <= 1 || isRunning"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>

            <button class="btn add-prize-btn" @click="addNewPrize" :disabled="isRunning">
              <i class="icon-plus"></i> 添加奖项
            </button>
          </div>
          <div class="modal-footer">
            <p class="settings-info">提示：至少保留一个奖项，删除奖项会同时清除该奖项的中奖记录</p>
            <button class="confirm-btn" @click="closeSettingsModal">确认</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 中奖弹窗提示（修复居中问题） -->
    <teleport to="body">
      <div class="winner-modal" v-if="showWinnerModal" @click="closeWinnerModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>恭喜中奖！</h3>
            <span class="close-btn" @click="closeWinnerModal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="prize-display">{{ currentPrizeLabel }}: {{ currentPrizeGift }}</div>
            <div class="winner-avatar">🎉</div>
            <div class="winner-details">
              <div class="winner-fullname">{{ currentWinners.map((w) => w.name).join('、') }}</div>
              <div class="winner-dept">
                {{ currentWinners.map((w) => w.department).join('、') }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="confirm-btn" @click="closeWinnerModal">确认</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
// 脚本部分保持不变，与上一版本相同
import { ref, computed, onMounted } from 'vue'

interface Participant {
  id: string
  name: string
  department: string
}

interface PrizeType {
  value: string
  label: string
  gift: string
  count: number
}

interface Winner extends Participant {
  prize: string
  timestamp: number
}

const participants = ref<Participant[]>([])
const prizeTypes = ref<PrizeType[]>([
  { value: 'first', label: '一等奖', gift: '98寸电视', count: 1 },
  { value: 'second', label: '二等奖', gift: '笔记本电脑', count: 3 },
  { value: 'third', label: '三等奖', gift: '智能手表', count: 5 },
  { value: 'special', label: '特别奖', gift: '购物卡', count: 2 },
])
const allWinners = ref<Winner[]>([])
const isRunning = ref<boolean>(false)
const selectedPrize = ref<string>('first')
const showWinnerModal = ref<boolean>(false)
const currentWinners = ref<Winner[]>([])
const currentPrizeLabel = ref<string>('')
const currentPrizeGift = ref<string>('')
const lotteryInterval = ref<number | null>(null)
const shuffledIndices = ref<number[]>([])
const showSettingsModal = ref<boolean>(false)

const selectedPrizeCount = computed<number>(() => {
  const prize = prizeTypes.value.find((p) => p.value === selectedPrize.value)
  return prize?.count || 1
})

const remainingParticipants = computed<Participant[]>(() => {
  const winnerIds = allWinners.value.map((w) => w.id)
  return participants.value.filter((p) => !winnerIds.includes(p.id))
})

const isWinner = (id: string): boolean => {
  return allWinners.value.some((w) => w.id === id)
}

const hasDrawn = (id: string): boolean => {
  return allWinners.value.some((w) => w.id === id)
}

const getPrizeLabel = (prizeValue: string): string => {
  const prize = prizeTypes.value.find((p) => p.value === prizeValue)
  return prize?.label || ''
}

const getPrizeGift = (prizeValue: string): string => {
  const prize = prizeTypes.value.find((p) => p.value === prizeValue)
  return prize?.gift || ''
}

const handlePrizeChange = () => {
  currentWinners.value = []
  currentPrizeLabel.value = getPrizeLabel(selectedPrize.value)
  currentPrizeGift.value = getPrizeGift(selectedPrize.value)
}

const openSettingsModal = () => {
  showSettingsModal.value = true
}

const closeSettingsModal = () => {
  showSettingsModal.value = false
  handlePrizeChange()
}

const addNewPrize = () => {
  const newId = `prize-${Date.now()}`
  prizeTypes.value.push({
    value: newId,
    label: `新奖项`,
    gift: `奖品`,
    count: 1,
  })

  if (prizeTypes.value.length === 1) {
    selectedPrize.value = newId
    handlePrizeChange()
  }
}

const removePrize = (index: number) => {
  const removedPrize = prizeTypes.value[index].value
  prizeTypes.value.splice(index, 1)

  if (selectedPrize.value === removedPrize) {
    selectedPrize.value = prizeTypes.value[0]?.value || ''
    handlePrizeChange()
  }

  allWinners.value = allWinners.value.filter((w) => w.prize !== removedPrize)
}

const shuffleParticipants = () => {
  const indices = Array.from({ length: remainingParticipants.value.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  shuffledIndices.value = indices
}

const toggleLottery = () => {
  if (isRunning.value) {
    stopLottery()
  } else {
    startLottery()
  }
}

const startLottery = () => {
  if (remainingParticipants.value.length < selectedPrizeCount.value) return

  isRunning.value = true

  lotteryInterval.value = window.setInterval(() => {
    shuffleParticipants()
  }, 100)
}

const stopLottery = () => {
  if (lotteryInterval.value) {
    clearInterval(lotteryInterval.value)
    lotteryInterval.value = null
  }

  isRunning.value = false
  selectWinners()
}

const selectWinners = () => {
  const winners: Winner[] = []
  const availableParticipants = [...remainingParticipants.value]

  for (let i = 0; i < selectedPrizeCount.value; i++) {
    if (availableParticipants.length === 0) break

    const randomIndex = Math.floor(Math.random() * availableParticipants.length)
    const selected = availableParticipants.splice(randomIndex, 1)[0]

    const winner: Winner = {
      ...selected,
      prize: selectedPrize.value,
      timestamp: Date.now(),
    }

    winners.push(winner)
  }

  allWinners.value.push(...winners)
  currentWinners.value = winners
  currentPrizeLabel.value = getPrizeLabel(selectedPrize.value)
  currentPrizeGift.value = getPrizeGift(selectedPrize.value)
  showWinnerModal.value = true
}

const closeWinnerModal = () => {
  showWinnerModal.value = false
  currentWinners.value = []
}

const resetLottery = () => {
  if (isRunning.value && lotteryInterval.value) {
    clearInterval(lotteryInterval.value)
    lotteryInterval.value = null
  }

  isRunning.value = false
  allWinners.value = []
  showWinnerModal.value = false
  currentWinners.value = []
  if (prizeTypes.value.length > 0) {
    selectedPrize.value = prizeTypes.value[0].value
    handlePrizeChange()
  }
}

const generateParticipants = (): Participant[] => {
  const departments = ['技术部', '市场部', '人事部', '财务部', '运营部', '销售部']
  const familyNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴']
  const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '军', '洋', '刚', '勇']

  return Array.from({ length: 80 }, (_, i) => ({
    id: `p${i + 1}`,
    name: `${familyNames[Math.floor(Math.random() * familyNames.length)]}${givenNames[Math.floor(Math.random() * givenNames.length)]}`,
    department: departments[Math.floor(Math.random() * departments.length)],
  }))
}

onMounted(() => {
  participants.value = generateParticipants()
  handlePrizeChange()
})
</script>

<style scoped>
/* 基础样式 */
.lottery-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

/* 标题区域 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  background: linear-gradient(45deg, #4ecdc4 0%, #556270 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-title {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

/* 控制面板 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 30px;
  padding: 15px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #556270;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-btn:hover:not(:disabled) {
  background-color: #414d5a;
  transform: translateY(-2px);
}

.settings-btn:disabled {
  background-color: #9aa3b0;
  cursor: not-allowed;
}

.prize-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prize-selector label {
  font-weight: 600;
  color: #333;
}

.prize-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 300px;
}

.prize-select:focus {
  outline: none;
  border-color: #4ecdc4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background-color: #f0f0f0;
  color: #666;
}

.reset-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.start-btn {
  background-color: #4ecdc4;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #3dbbaf;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(78, 205, 196, 0.3);
}

.start-btn:disabled {
  background-color: #b3d9d6;
  cursor: not-allowed;
}

/* 主内容区域（宽屏布局） */
.main-content {
  display: flex;
  gap: 30px;
  height: calc(100vh - 240px);
}

.section-title {
  font-size: 1.3rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

/* 抽奖矩阵区域 */
.lottery-grid-container {
  flex: 4; /* 增加抽奖区域宽度占比 */
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.lottery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.participant-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px 10px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.participant-card .name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
}

.participant-card .department {
  font-size: 0.8rem;
  color: #666;
}

/* 修复闪烁效果 */
.participant-card.shuffling {
  animation: shuffle 0.5s infinite;
}

/* 新增脉冲闪烁效果 */
.participant-card.pulsing {
  animation: pulse 0.6s infinite alternate;
}

.participant-card.drawn {
  opacity: 0.6;
  filter: grayscale(0.7);
}

.participant-card.winner {
  background: linear-gradient(135deg, #ffec61 0%, #f3b664 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 236, 97, 0.4);
  border: 2px solid #ffc107;
  animation: winnerPulse 1s infinite;
}

.participant-card.winner .name {
  color: #d35400;
  font-weight: 700;
}

.participant-card.winner .department {
  color: #e67e22;
}

.winner-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 5px 15px;
  border-radius: 30px;
  transform: rotate(15deg);
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 中奖结果展示（调整为更窄宽度） */
.results-section {
  flex: 1.5; /* 减小结果区域宽度占比 */
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-results {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.winner-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.winner-info {
  display: flex;
  flex-direction: column;
}

.winner-name {
  font-weight: 600;
  color: #333;
}

.winner-department {
  font-size: 0.8rem;
  color: #666;
}

.winner-prize {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  text-align: right;
}

.prize-first {
  background-color: #e74c3c;
}

.prize-second {
  background-color: #3498db;
}

.prize-third {
  background-color: #2ecc71;
}

.prize-special {
  background-color: #9b59b6;
}

/* 奖项设置弹窗样式 */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* 弹窗通用样式 */
.modal-content {
  background-color: white;
  border-radius: 15px;
  width: 90%;
  max-width: 1000px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(45deg, #556270 0%, #4ecdc4 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: none;
  border: none;
  color: white;
  padding: 0 10px;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
}

.prize-forms {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.prize-form {
  display: flex;
  gap: 20px;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4ecdc4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
}

.form-actions {
  min-width: 100px;
  display: flex;
  align-items: center;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  width: 100%;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.delete-btn:disabled {
  background-color: #ec7063;
  cursor: not-allowed;
}

.add-prize-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2ecc71;
  color: white;
  padding: 12px 20px;
  width: 100%;
  justify-content: center;
}

.add-prize-btn:hover:not(:disabled) {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3);
}

.add-prize-btn:disabled {
  background-color: #a9dfbf;
  cursor: not-allowed;
}

.modal-footer {
  padding: 15px 30px;
  background-color: #f9f9f9;
  text-align: center;
  border-top: 1px solid #eee;
}

.settings-info {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
  text-align: left;
}

.confirm-btn {
  padding: 12px 30px;
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background-color: #3dbbaf;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(78, 205, 196, 0.3);
}

/* 中奖弹窗提示（修复居中问题） */
.winner-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* 修复弹窗内容居中 */
.winner-modal .modal-content {
  max-width: 600px;
  width: 90%;
}

.winner-modal .modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 30px;
}

.prize-display {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #e74c3c;
  animation: pulse 1.5s infinite;
}

.winner-avatar {
  font-size: 5rem;
  margin-bottom: 20px;
}

.winner-details {
  width: 100%;
}

.winner-fullname {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
}

.winner-dept {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

/* 动画效果 */
@keyframes shuffle {
  0%,
  100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(10deg);
  }
}

/* 新增卡片闪烁动画 */
@keyframes pulse {
  from {
    opacity: 0.7;
    box-shadow: 0 0 0 0 rgba(78, 205, 196, 0.4);
  }
  to {
    opacity: 1;
    box-shadow: 0 0 0 8px rgba(78, 205, 196, 0);
  }
}

/* 中奖卡片闪烁动画 */
@keyframes winnerPulse {
  0%,
  100% {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.6);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 25px rgba(255, 193, 7, 0.8);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.7);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 图标样式 */
.icon-cog::before {
  content: '⚙️';
}
.icon-plus::before {
  content: '+';
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }

  .lottery-grid-container,
  .results-section {
    max-height: 500px;
  }

  .prize-form {
    flex-wrap: wrap;
  }

  .form-group {
    min-width: 40%;
  }
}

@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .prize-form {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group {
    min-width: 100%;
  }

  .form-actions {
    text-align: right;
    width: 100%;
  }

  .action-buttons {
    justify-content: space-between;
  }

  .lottery-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .prize-select {
    min-width: 100%;
  }
}
</style>
