'use client'
import React, { useEffect, useRef, useState } from 'react'
import CommunityWizard from '../../../Components/CommunityWizard'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'

function Communities() {
  const [modal, setModal] = useState(false)
  const [title, setTitle] = useState('')
  const [communities, setCommunities] = useState([])
  const [popularCommunities, setPopularCommunities] = useState([])
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [activeTab, setActiveTab] = useState('All')

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const timeOutRef = useRef(null)
  const router = useRouter()

  const tabs = ['All', 'Popular', 'Joined']
  const isSearching = title.trim() !== ''

  /* ================= FETCH FUNCTIONS ================= */
  const fetchAll = async (pageNo = 0) => {
        const token=getToken();

    try {
      const res = await axios.get(
        '/proxy/api/community/getAll',
        {
          params: { page: pageNo, size: 9 },
                                headers:{
            Authorization: `Bearer ${token}`
          },
        }
      )
      setCommunities(res.data.content)
      setPage(res.data.number)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPopAll = async (pageNo = 0) => {
        const token=getToken();

    try {
      const res = await axios.get(
        '/proxy/api/community/getPop',
        {
          params: { page: pageNo, size: 9 },
                                headers:{
            Authorization: `Bearer ${token}`
          },
        }
      )
      setPopularCommunities(res.data.content)
      setPage(res.data.number)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchJoined = async () => {
        const token=getToken();

    try {
      const res = await axios.get(
        '/proxy/api/community/joinedCom',
        {                       headers:{
            Authorization: `Bearer ${token}`
          } }
      )
      setJoinedCommunities(res.data)
      setTotalPages(0)
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= SEARCH API ================= */
  const callApi = async (value) => {
    if (!value.trim()) return
        const token=getToken();

    try {
      const url =
        activeTab === 'Popular'
          ? `/proxy/api/community/searchPop/${value}`
          : `/proxy/api/community/search/${value}`

      const res = await axios.get(url, {                       headers:{
            Authorization: `Bearer ${token}`
          } })

      if (activeTab === 'Popular') setPopularCommunities(res.data)
      else setCommunities(res.data)

      setTotalPages(0) // disable pagination during search
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= DEBOUNCE ================= */
  function debounce(e) {
    const value = e.target.value
    setTitle(value)
    clearTimeout(timeOutRef.current)

    if (!value.trim()) {
      if (activeTab === 'Popular') fetchPopAll(0)
      else if (activeTab === 'Joined') fetchJoined()
      else fetchAll(0)
      return
    }

    timeOutRef.current = setTimeout(() => {
      callApi(value)
    }, 500)
  }

  /* ================= REDIRECTION ================= */
  function handleRedirection(id) {
    router.push(`communitypage/${id}`)
  }

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchAll(0)
    return () => clearTimeout(timeOutRef.current)
  }, [])

  /* ================= CURRENT LIST ================= */
  const getCurrentList = () => {
    if (activeTab === 'Popular') return popularCommunities
    if (activeTab === 'Joined') return joinedCommunities
    return communities
  }

  /* ================= PAGINATION HANDLERS ================= */
  const handlePrev = () => {
    if (page === 0) return
    const newPage = page - 1
    activeTab === 'Popular' ? fetchPopAll(newPage) : fetchAll(newPage)
  }

  const handleNext = () => {
    if (page + 1 >= totalPages) return
    const newPage = page + 1
    activeTab === 'Popular' ? fetchPopAll(newPage) : fetchAll(newPage)
  }

  return (
    <>
      <section className="min-h-screen w-full bg-black text-white px-4 py-10">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">

          {/* ===== Header ===== */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Explore Communities
              </h1>
              <p className="mt-2 text-gray-400 max-w-xl">
                Discover spaces that match your interests and connect with people who get you.
              </p>
            </div>

            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-2 transition hover:border-amber-500 hover:bg-neutral-800"
            >
              <span className="text-xl">＋</span>
              <span className="font-medium">Create community</span>
            </button>
          </div>

          {/* ===== Search ===== */}
          <input
            type="text"
            value={title}
            onChange={debounce}
            placeholder="Search communities..."
            className="w-full sm:w-2/3 rounded-full border border-neutral-800 bg-neutral-950 px-5 py-3 text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />

          {/* ===== Tabs ===== */}
          <div className="flex gap-2 rounded-full bg-black p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setTitle('')
                  if (tab === 'Popular') fetchPopAll(0)
                  else if (tab === 'Joined') fetchJoined()
                  else fetchAll(0)
                }}
                className={`rounded-full px-6 py-2 text-sm transition cursor-pointer
                  ${activeTab === tab
                    ? 'bg-[#e5e7eb] text-black'
                    : 'text-gray-300 hover:bg-neutral-900 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== Community Grid (UNCHANGED) ===== */}
          {getCurrentList().length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {getCurrentList().map((item) => (
                <article
                  key={activeTab === 'Joined' ? item.communityId : item.id}
                  onClick={() =>
                    handleRedirection(
                      activeTab === 'Joined' ? item.communityId : item.id
                    )
                  }
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010] p-5 transition hover:border-white/25 cursor-pointer"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#101010] text-lg font-bold">
                        {item.communityTitle?.[0] || 'C'}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {item.communityTitle}
                        </h2>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {item.communityBio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {activeTab !== 'Joined' &&
                        item.topicIds?.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-gray-300"
                          >
                            #{topic}
                          </span>
                        ))}
                      <span className="ml-auto text-xs text-gray-400">
                        {activeTab === 'Joined'
                          ? `Joined on ${item.joinedAt}`
                          : `${item.members} members`}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <h1 className="text-center text-gray-400 text-lg mt-10">
              No communities found
            </h1>
          )}

          {/* ===== Pagination (Prev / Next like screenshot) ===== */}
          {!isSearching && activeTab !== 'Joined' && totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="rounded-full border border-white/20 px-6 py-2 text-sm text-white disabled:opacity-40 hover:border-white/40 transition"
              >
                Prev
              </button>

              <button
                onClick={handleNext}
                disabled={page + 1 === totalPages}
                className="rounded-full border border-white/20 px-6 py-2 text-sm text-white disabled:opacity-40 hover:border-white/40 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== Modal ===== */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <CommunityWizard modal={modal} setModal={setModal} />
        </div>
      )}
    </>
  )
}

export default Communities
