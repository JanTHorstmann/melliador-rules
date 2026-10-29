# Melliador Rules – Kernaufgaben und Arbeitsschritte

## Zweck und Leitlinien

Diese Aufgabenübersicht zerlegt das Projekt in große Kernaufgaben und die konkreten Schritte, die jeweils zum Ziel führen. Die aktuelle Kernaufgabe ist bis auf benötigte Daten, Berechnungen, Funktionen, Schnittstellen, Validierung und Tests ausgearbeitet. Spätere Kernaufgaben bleiben zunächst grob. Die offiziellen Melliador-Regeln sind maßgeblich. Technische Beispiele aus D&D5e dienen ausschließlich als Anschauung für Foundry-Integration und müssen auf das Melliador-Datenmodell übertragen werden.

- **BELEGT** kennzeichnet Aussagen aus einer offiziellen Regelquelle mit Seite.
- **ABGELEITET** kennzeichnet technische oder organisatorische Entscheidungen.
- **OFFEN** kennzeichnet Fragen, die vor einer fachlich oder technisch folgenreichen Implementierung geklärt werden müssen.
- Der Regelkern bleibt unabhängig von Foundry und Charakterbogen.
- Foundry-Zugriff liegt im Adapter; Charakterbogen und Darstellung bleiben bei Melliador Helpers.
- Keine Regelwerte, IDs, Datenpfade, Fehlerverträge oder öffentlichen APIs stillschweigend erfinden.

## Projektstand

- Die Projektstruktur mit Projektmanagement, Quellenreferenz, Spezifikationen, Quellcode, Tests und technischer Dokumentation ist angelegt.
- `03_src/index.js` ist der einzige derzeit gefundene Quellcode-Einstiegspunkt.
- Unter `04_tests` liegen ein Testkonzept und `test_charakter.json`; automatisierte Testdateien wurden nicht gefunden.
- Die Testfigur ist ein Foundry-Export eines D&D5e-Actors (`type: character`, `systemId: dnd5e`, Exportangabe `systemVersion: 6.0.5`). Attribute stehen in diesem Beispiel unter `system.abilities.<id>.value`. Das beschreibt nur diese Testdatei und legt kein Melliador-Datenmodell fest.
- Als offizielle Regelquelle ist der „Melliador-Schnellstarter, Version 1.2“ dokumentiert. Das PDF hat 94 Seiten.
- Die öffentliche API, Actor-Auflösung für Token, Fehlerverträge und die Datenpfade des späteren Melliador-Actors sind noch nicht entschieden.

## Kernaufgabe 1 – Attributswurf erstellen

**Ziel:** Eine Spielleitung oder ein Charakterbogen kann eine Attributsprobe anfordern. Das System liest die benötigten Actor-Werte über den Foundry-Adapter aus, berechnet den Wurf im unabhängigen Regelkern, verwendet `rollD20()` als Würfelquelle und gibt ein geprüftes, strukturiertes Ergebnis zurück.

**Erfolgskriterium:** Für einen vollständig spezifizierten und gültigen Auftrag werden die regelrelevanten Werte nachvollziehbar kombiniert; derselbe Regelkern kann mit Testdaten ohne Foundry ausgeführt werden. Fehlerhafte oder unvollständige Pflichtdaten ergeben einen ausdrücklich definierten Fehler statt eines stillen Ersatzwertes.

### Arbeitsschritte

### 1.1 Herausfinden, was ein Attributswurf benötigt

- [ ] **Attribut-ID und Attributswert:** Welche sechs Attribute verarbeitet die erste Version? Welche stabile englische ID gehört zu jedem Regelattribut?
- [ ] **Attributsmodifikator:** Aus welchem Attributswert wird er ermittelt? Die Tabelle und Randwerte aus der Quelle vollständig verifizieren.
- [ ] **Übung:** Klären, ob die angeforderte Probe nur das Attribut oder zusätzlich eine Fertigkeit bzw. ein Werkzeug umfasst und wann Übungsbonus gilt.
- [ ] **Vorteil/Nachteil:** Entscheiden, ob diese Mechanik in den ersten Attributswurf fällt. Falls ja, muss der Würfelzugriff mehr als einen W20 unterstützen können.
- [ ] **Zielwert:** Festlegen, dass der SG aus der Spielleitungsanfrage kommt und nicht durch den Regelkern bestimmt wird.
- [ ] **Gesamtergebnis:** Die belegte Erfolgskante `total >= target` spezifizieren.
- [ ] **Sonderfälle:** Prüfen, ob kritische Ergebnisse oder weitere Ausnahmen auf Attributswürfe anzuwenden sind.

### 1.2 Benötigte Eingangsdaten festlegen

- [ ] Probenanforderung: Actor-Bezug, Attribut-ID und SG; optionale Eingaben nur aufnehmen, wenn sie fachlich benötigt sind.
- [ ] Actor-Daten: benötigten Attributswert und gegebenenfalls Übungs-/Fertigkeits-/Werkzeugdaten benennen.
- [ ] Zwischen Actor-Rohdaten und Regelkern ein kleines, dokumentiertes Eingabemodell festlegen.
- [ ] Geklärt haben, ob eine Anforderung einen Welt-Actor (`actorId`) oder einen tokengebundenen Actor adressieren darf.
- [ ] Keine Feldpfade aus der Testfigur als Melliador-Datenmodell festschreiben.

### 1.3 Öffentliche Anforderung und Verantwortungsgrenzen entwerfen

- [ ] Ablauf verfolgen: Chat-Probenanfrage → öffentliche API → Foundry-Adapter → Regelkern → strukturiertes Ergebnis.
- [ ] Festlegen, welche Funktion Helpers aufrufen und wie der SG übermittelt wird.
- [ ] Festlegen, ob der API-Aufruf synchron oder asynchron ist und wie sein Fehlerfall signalisiert wird.
- [ ] Abgrenzen: API nimmt Anfrage entgegen; Adapter löst Actor auf und liest Daten; Kern validiert Regelwerte und berechnet; Darstellung/Chat-Ausgabe bleibt Integrations- bzw. Helpers-Aufgabe.
- [ ] Ergebnisfelder vor Implementierung verbindlich benennen; vorgeschlagene Namen in vorhandener Dokumentation prüfen.

### 1.4 Berechnungsfunktionen und Funktionsaufrufe festlegen

- [ ] `rollD20()` als zufällige W20-Quelle verwenden. Die bestehende Spezifikation sieht eine ganze Zahl von 1 bis 20 vor.
- [ ] Würfelquelle für regelkernunabhängige, reproduzierbare Tests austauschbar halten.
- [ ] Eine reine Kernfunktion für Attributswurf-Berechnung definieren, die keine Foundry-Objekte kennt.
- [ ] Reihenfolge der Verarbeitung festschreiben: Eingaben validieren → Würfelwert(e) beziehen → regelbelegte Modifikatoren bestimmen/anwenden → `total` berechnen → mit `target` vergleichen → Ergebnis zurückgeben.
- [ ] Falls Vorteil/Nachteil umgesetzt wird, das Würfelziehen dafür explizit spezifizieren; nicht in `rollD20()` versteckte Regelentscheidungen aufnehmen.
- [ ] Im Foundry-Adapter eine Anforderungsfunktion vorsehen, die Actor auflöst und nur benötigte Werte an den Kern übergibt.
- [ ] Vorhandene öffentliche API-Dokumentation auf Funktionsnamen und Ergebnisformat abgleichen; keine konkurrierende API erfinden.

### 1.5 Eingaben, Fehler und Ergebnis spezifizieren

- [ ] Fehlerfall: Actor nicht gefunden oder im angesprochenen Kontext nicht verfügbar.
- [ ] Fehlerfall: unbekannte oder fehlende Attribut-ID.
- [ ] Fehlerfall: Attributwert fehlt, ist nicht numerisch oder liegt außerhalb des spezifizierten Bereichs.
- [ ] Fehlerfall: SG fehlt, ist nicht numerisch oder verletzt die festgelegte Eingaberegel.
- [ ] Fehlerfall: ungültige/unerwartete Würfelquelle.
- [ ] Einheitliche Fehlerantwort und stabile Fehlerkennungen für die öffentliche Schnittstelle abstimmen.
- [ ] Ergebnis mindestens hinsichtlich Wurfart, Actor-Bezug, Attribut-ID, Würfelwert, angewandtem Modifikator, Ziel, Gesamt und Erfolg spezifizieren; endgültige Felder erst nach API-Abgleich festlegen.
- [ ] Keine fehlenden Pflichtwerte stillschweigend durch `0` ersetzen.

### 1.6 Quellenprüfung und Quellenreferenz abschließen

- [ ] Schnellstarter-Version und relevante Seiten nachvollziehbar festhalten.
- [ ] Attributswerte/Modifikatoren, Übungsbonus, Fertigkeiten, Werkzeugübung, Vorteil/Nachteil und SG getrennt erfassen.
- [ ] Für jeden verwendeten Regelbestandteil Quelle und Seitenverweis in `01_rules_reference` dokumentieren.
- [ ] Beispiele und vorgefertigte Charaktere nicht ohne Prüfung als allgemeine Regel verallgemeinern.

### 1.7 Spezifikation und Implementierung vorbereiten

- [ ] `02_rule_specifications` um vollständige Eingaben, Verarbeitung, Ausgaben und Fehlerfälle der Attributsprobe ergänzen.
- [ ] Architektur-/API-Entscheidungen vor einer öffentlichen oder systemprägenden Festlegung in Projektmanagement-Dokumentation festhalten.
- [ ] Erst nach Klärung fachlicher und datenmodellrelevanter Fragen Kernfunktion und Adapter implementieren.
- [ ] Regeltests mit kontrollierten Würfelwerten: Erfolg, Misserfolg, exakter Zielwert, minimale/maximale gültige Attribute und ungültige Eingaben.
- [ ] Adaptertests getrennt: Actor nicht gefunden, erwarteter Actor-Kontext, benötigte Felder vorhanden/fehlend.
- [ ] Öffentliche API und technische Dokumentation mit der tatsächlichen Implementierung abgleichen.

### Prüfstand der Regelquelle für diese Kernaufgabe

- **BELEGT – Basiswurf:** Ein einzelner W20, Modifikationen addieren, Vergleich mit SG; Erfolg bei Erreichen oder Überschreiten des SG (PDF S. 24).
- **BELEGT – Wurfarten:** Attributswürfe betreffen aktives Handeln außerhalb von Angriffen; die Spielleitung legt deren Schwierigkeit situationsabhängig fest. Rettungswürfe reagieren auf externe Gefahren; Angriffe vergleichen gegen RK (PDF S. 24).
- **BELEGT – Attribute:** STÄ, KON, GES, INT, WEI und CHA; SC-Attributswerte liegen laut Schnellstarter zwischen 8 und 20 (PDF S. 24).
- **BELEGT – Attributsmodifikator:** Tabelle auf PDF S. 25 führt 4–5 = −3, 6–7 = −2, 8–9 = −1, 10–11 = +0, 12–13 = +1, 14–15 = +2, 16–17 = +3 und 18–19 = +4 auf.
- **OFFEN – Wert 20:** Der Schnellstarter nennt SC-Attributswerte bis 20 (PDF S. 24), aber die Tabelle auf S. 25 endet bei 18–19 = +4 und zeigt keinen Eintrag für 20. Der erwartete Wert +5 passt zur üblichen 5e-Fortsetzung, ist durch diese Tabellenstelle allein aber nicht belegt. Als gewünschtes Ergebnis ist +5 vorgemerkt; vor der Implementierung als belegte Melliador-Regel muss die Tabellenstelle visuell geprüft und möglichst eine weitere offizielle Melliador-Quelle herangezogen werden.
- **BELEGT – Übung:** Modifikatoren stammen vor allem aus Attributsmodifikator und Übungsbonus. Übungsbonus für SC auf Stufen 1–4 ist +2; bei einer Fertigkeit oder einem Werkzeug wird er nur einmal addiert, wenn beide einschlägig sind (PDF S. 25–26).
- **BELEGT – Vorteil/Nachteil:** Zweiter W20, höheres bzw. niedrigeres Ergebnis; mehrere Quellen kumulieren nicht, und Vorteil/Nachteil heben sich gegenseitig auf (PDF S. 26).
- **OFFEN für dieses Arbeitspaket:** Welche optionalen Wurfbestandteile die erste API unterstützt, wie Fertigkeit/Werkzeugübung aus einem Melliador-Actor gelesen wird, ob das Ergebnisformat bestehende Benennungsvorgaben hat und welche Fehlerantworten öffentlich stabil sein sollen.

## Kernaufgabe 2 – Rettungswürfe erstellen (vorläufig)

Diese Punkte sind zunächst Themenüberschriften. Umfang und Reihenfolge werden nach Abschluss der Attributsprobe anhand der Quellen und Projektentscheidungen konkretisiert.

1. Regelquelle und benötigte Werte identifizieren.
2. Eingaben, Berechnung, Ausgabe und Fehlerfälle spezifizieren.
3. Kernfunktion, Adapter und Tests ergänzen.

## Kernaufgabe 3 – Angriffswürfe erstellen (vorläufig)

1. Waffen- und Zauberangriffe anhand der Quelle unterscheiden.
2. Ziel-RK, Attribute, Übungsbonus, Waffenmerkmale und Sonderfälle spezifizieren.
3. Kernfunktion, Adapter und Tests ergänzen.

## Kernaufgabe 4 – Weitere Regeln und Würfelmechaniken umsetzen (vorläufig)

Regelreferenzen und Spezifikationen für Vorteil/Nachteil, kritische Ergebnisse sowie Kampf, Schaden/Heilung, Ausrüstung, Magie und Sonderregeln schrittweise vervollständigen.

## Kernaufgabe 5 – Öffentliche Schnittstelle und Foundry-Integration vervollständigen (vorläufig)

Versionierten Vertrag mit Melliador Helpers abstimmen; Chat-Anfragen, Actor-/Token-Kontext, Rückgabe, Fehlerverhalten und Kompatibilität integrieren.

## Kernaufgabe 6 – Test- und Veröffentlichungsgrundlage festlegen (vorläufig)

Testframework, Paket-/Build-Entscheidungen, Foundry-Kompatibilität, Installation und Wartung entsprechend dem wachsenden Codebestand festlegen.

## Entscheidungspunkte

| Thema | Status | Nächster Klärungsschritt |
|---|---|---|
| Attributsmodifikator für Wert 20 und mögliche Werte außerhalb des Schnellstarterbereichs | OFFEN | PDF-Seite visuell prüfen und vollständige offizielle Quelle abgleichen |
| Regelumfang des ersten Attributswurf-Vertrags (nur Attribut oder auch Fertigkeit/Werkzeug/Vorteil) | OFFEN | Nach Quellenprüfung konkret vorschlagen und abstimmen |
| Melliador-Actor-Feldpfade | OFFEN | Melliador-Actor-Beispiel bzw. Schema bereitstellen/prüfen |
| Actor aus Welt-Sammlung oder Token-Kontext | OFFEN | Integrationsfall und gewünschte Zuordnung klären; derzeitiger Entwurf nutzt `game.actors.get(actorId)` |
| API-Funktionssignatur und Rückgabeformat | OFFEN | Vor Umsetzung als öffentlichen Vertrag festlegen |
| Fehlerformat und ungültige Eingaben | OFFEN | Einheitliches Fehlerverhalten vor öffentlicher API festlegen |
| Foundry- und D&D5e-Beispielversion | OFFEN | Nur für Kompatibilitätsanalyse festlegen; keine Laufzeitabhängigkeit ableiten |
| Testframework, Build, Paketmanagement | OFFEN | Nach erstem isolierten Kernmodul anhand vorhandener Umgebung entscheiden |

## Quellen und technische Referenzen

- Melliador-Schnellstarter 1.2, Datei `Melliador_Schnellstarter_1_2__261002.pdf`, insbesondere PDF S. 24–26 für Basiswürfe, Attribute, Modifikatoren, Übung und Vorteil/Nachteil.
- Foundry VTT API: Actor-Dokument und `game.actors.get(actorId)`: https://foundryvtt.com/api/classes/foundry.documents.Actor.html
- Foundry VTT System Development: Datenmodelle, Dokumentklassen und Vorbereitung abgeleiteter Daten: https://foundryvtt.com/article/system-development/
- D&D5e System-Wiki: Roll-Formeln und Actor-Roll-Daten, Stand laut Wiki 6.0.0: https://github.com/foundryvtt/dnd5e/wiki/Roll-Formulas
- D&D5e System-Wiki: Roll-Hooks, als systemspezifisches Integrationsbeispiel: https://github.com/foundryvtt/dnd5e/wiki/Hooks

Die Foundry- und D&D5e-Referenzen erklären technische Muster. Sie belegen keine Melliador-Regeln und legen weder Melliador-Datenpfade noch die Melliador-API fest.
