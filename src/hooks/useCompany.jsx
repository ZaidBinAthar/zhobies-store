import { createContext, useContext, useState, useEffect } from 'react'
import { fetchCompany, getLocalCompany, updateCompany as updateCompanyApi, DEFAULT_COMPANY_ID } from '../utils/companyStore'

const CompanyContext = createContext({
  company: getLocalCompany(),
  loading: false,
  updateSettings: async () => {},
  reloadCompany: async () => {}
})

export function CompanyProvider({ children, companyId = DEFAULT_COMPANY_ID }) {
  const [company, setCompany] = useState(getLocalCompany())
  const [loading, setLoading] = useState(false)

  const reloadCompany = async (id = companyId) => {
    setLoading(true)
    try {
      const data = await fetchCompany(id)
      if (data) setCompany(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadCompany(companyId)

    const handleUpdate = (e) => {
      if (e.detail) {
        setCompany(e.detail)
      } else {
        setCompany(getLocalCompany())
      }
    }

    window.addEventListener('company_updated', handleUpdate)
    return () => window.removeEventListener('company_updated', handleUpdate)
  }, [companyId])

  const updateSettings = async (newData, targetCompanyId = companyId) => {
    const res = await updateCompanyApi(targetCompanyId, newData)
    if (res?.data) {
      setCompany(res.data)
    }
    return res
  }

  return (
    <CompanyContext.Provider value={{ company, loading, updateSettings, reloadCompany }}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  return useContext(CompanyContext)
}

