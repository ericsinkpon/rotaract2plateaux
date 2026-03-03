// Script pour le widget flottant des réunions

function toggleMeetingWidget() {
    const widget = document.getElementById('meetingWidget');
    widget.classList.toggle('expanded');
}

// Calculer la prochaine date de réunion (1er et 3e jeudi du mois)
function getNextMeetingDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Fonction pour obtenir le nième jeudi du mois
    function getNthThursday(year, month, n) {
        const firstDay = new Date(year, month, 1);
        const dayOfWeek = firstDay.getDay(); // 0 = dimanche, 4 = jeudi
        const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
        const firstThursday = 1 + daysUntilThursday;
        const nthThursday = firstThursday + (n - 1) * 7;
        return new Date(year, month, nthThursday);
    }
    
    // Obtenir le 1er et 3e jeudi du mois actuel
    const firstThursday = getNthThursday(currentYear, currentMonth, 1);
    const thirdThursday = getNthThursday(currentYear, currentMonth, 3);
    
    // Déterminer quelle est la prochaine réunion
    let nextMeeting;
    if (now < firstThursday) {
        nextMeeting = firstThursday;
    } else if (now < thirdThursday) {
        nextMeeting = thirdThursday;
    } else {
        // Passer au mois suivant
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        nextMeeting = getNthThursday(nextYear, nextMonth, 1);
    }
    
    return nextMeeting;
}

// Formater la date en français
function formatMeetingDate(date) {
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${month} ${year}`;
}

// Initialiser le widget
document.addEventListener('DOMContentLoaded', function() {
    const nextMeeting = getNextMeetingDate();
    const formattedDate = formatMeetingDate(nextMeeting);
    document.getElementById('nextMeetingDate').textContent = formattedDate;
    
    // Fermer le widget si on clique en dehors
    document.addEventListener('click', function(e) {
        const widget = document.getElementById('meetingWidget');
        const toggle = document.querySelector('.floating-meeting-widget__toggle');
        const closeBtn = document.querySelector('.floating-meeting-widget__close');
        
        if (widget.classList.contains('expanded') && 
            !widget.contains(e.target) && 
            e.target !== toggle) {
            widget.classList.remove('expanded');
        }
    });
});

