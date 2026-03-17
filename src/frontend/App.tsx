import { useAppPresenter } from './presenter/useAppPresenter'
import { TabBar } from './components/shared/TabBar'
import { PeopleView } from './views/PeopleView'
import { TeamsView } from './views/TeamsView'
import { PresetsView } from './views/PresetsView'

export function App() {
  const presenter = useAppPresenter()

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Team Balancer</h1>
        <TabBar
          tabs={['people', 'teams', 'presets']}
          active={presenter.activeTab}
          onChange={presenter.setActiveTab}
        />
      </header>

      <main className="app__main">
        {presenter.activeTab === 'people' && (
          <PeopleView
            constraints={presenter.constraints}
            people={presenter.people}
            topPeople={presenter.topPeople}
            teamSize={presenter.teamSize}
            error={presenter.error}
            addConstraint={presenter.addConstraint}
            removeConstraint={presenter.removeConstraint}
            updateConstraintWeight={presenter.updateConstraintWeight}
            addPerson={presenter.addPerson}
            removePerson={presenter.removePerson}
            updatePerson={presenter.updatePerson}
            clearPeople={presenter.clearPeople}
            setTeamSize={presenter.setTeamSize}
            runBalance={presenter.runBalance}
            generateDemo={presenter.generateDemo}
          />
        )}

        {presenter.activeTab === 'teams' && (
          <TeamsView
            result={presenter.result}
            constraints={presenter.constraints}
            onSwap={presenter.swapMembers}
            onRerun={presenter.runBalance}
            onCopyToClipboard={presenter.copyToClipboard}
            onDownloadCSV={presenter.downloadCSV}
          />
        )}

        {presenter.activeTab === 'presets' && (
          <PresetsView
            presets={presenter.presets}
            onLoad={presenter.loadPreset}
            onDelete={presenter.deletePreset}
            onSave={presenter.savePreset}
          />
        )}
      </main>
    </div>
  )
}
