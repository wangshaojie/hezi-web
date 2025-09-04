<template>
  <!-- 主内容区 -->
  <main class="ml-64 flex-1 p-8">
    <!-- 工具头部信息 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div class="h-64 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
      <div class="p-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">GitHub</h1>
            <div class="flex items-center space-x-4 mb-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >开发工具</span
              >
              <span class="text-gray-500">全球最大的代码托管平台</span>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            访问官网
          </a>
        </div>
        <p class="text-gray-700 text-lg leading-relaxed mt-4">
          GitHub是一个面向开源及私有软件项目的托管平台，因为只支持Git作为唯一的版本库格式进行托管，故名GitHub。它提供了强大的代码托管、版本控制、协作功能和项目管理工具，是全球开发者首选的代码托管平台。
        </p>
      </div>
    </div>

    <!-- 工具详情内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 主要特性 -->
      <div class="lg:col-span-2 space-y-6">
        <section class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">核心功能</h2>
          <ul class="space-y-4">
            <li class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 text-blue-500 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">代码托管</h3>
                <p class="text-gray-600">无限量的公共仓库和私有仓库托管服务</p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 text-blue-500 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">版本控制</h3>
                <p class="text-gray-600">基于Git的分布式版本控制系统</p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 text-blue-500 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">协作开发</h3>
                <p class="text-gray-600">Pull Request、Issue跟踪、代码审查等协作工具</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">使用指南</h2>
          <div class="prose max-w-none">
            <h3 class="text-lg font-medium text-gray-800">基础使用</h3>
            <ol class="list-decimal pl-5 space-y-2">
              <li>注册GitHub账号</li>
              <li>创建新仓库或fork现有项目</li>
              <li>使用Git客户端克隆仓库到本地</li>
              <li>进行代码修改并提交</li>
              <li>推送更改到远程仓库</li>
            </ol>

            <h3 class="text-lg font-medium text-gray-800 mt-6">高级功能</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>使用GitHub Actions实现CI/CD</li>
              <li>利用GitHub Pages部署静态网站</li>
              <li>通过GitHub Projects管理项目进度</li>
              <li>使用GitHub Codespaces进行云端开发</li>
            </ul>
          </div>
        </section>
      </div>

      <!-- 侧边信息 -->
      <div class="space-y-6">
        <section class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">基本信息</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">官方网站</h3>
              <a href="https://github.com" class="text-blue-500 hover:underline">github.com</a>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">成立时间</h3>
              <p class="text-gray-800">2008年</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">母公司</h3>
              <p class="text-gray-800">Microsoft</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">定价</h3>
              <p class="text-gray-800">免费（公开仓库）<br />付费（私有仓库和企业功能）</p>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">相关工具</h2>
          <div class="space-y-4">
            <a href="#" class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 bg-blue-100 rounded-lg mr-3"></div>
              <div>
                <h3 class="font-medium text-gray-800">GitLab</h3>
                <p class="text-sm text-gray-500">替代的代码托管平台</p>
              </div>
            </a>
            <a href="#" class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 bg-green-100 rounded-lg mr-3"></div>
              <div>
                <h3 class="font-medium text-gray-800">Bitbucket</h3>
                <p class="text-sm text-gray-500">Atlassian的代码托管服务</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
