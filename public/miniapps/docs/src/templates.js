/**
 * Document Templates
 * Pre-built templates for common document types
 */

export const DocumentTemplates = {
  /**
   * Template registry
   */
  templates: {
    blank: {
      id: 'blank',
      name: 'Blank Document',
      description: 'Start with an empty document',
      icon: 'document',
      category: 'basic',
      content: '<p>Start writing...</p>'
    },

    meetingNotes: {
      id: 'meetingNotes',
      name: 'Meeting Notes',
      description: 'Document meeting discussions and action items',
      icon: 'calendar',
      category: 'productivity',
      content: `
                <h2>Meeting Notes</h2>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Attendees:</strong></p>
                <ul>
                    <li></li>
                </ul>

                <h3>Agenda</h3>
                <ol>
                    <li></li>
                </ol>

                <h3>Discussion Points</h3>
                <ul>
                    <li></li>
                </ul>

                <h3>Action Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Owner</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <h3>Next Meeting</h3>
                <p><strong>Date:</strong></p>
                <p><strong>Time:</strong></p>
            `
    },

    projectProposal: {
      id: 'projectProposal',
      name: 'Project Proposal',
      description: 'Outline project goals, timeline, and resources',
      icon: 'box',
      category: 'business',
      content: `
                <h1>Project Proposal</h1>

                <h2>Executive Summary</h2>
                <p>Brief overview of the project...</p>

                <h2>Problem Statement</h2>
                <p>What problem does this project solve?</p>

                <h2>Objectives</h2>
                <ul>
                    <li>Objective 1</li>
                    <li>Objective 2</li>
                    <li>Objective 3</li>
                </ul>

                <h2>Scope</h2>
                <h3>In Scope</h3>
                <ul>
                    <li></li>
                </ul>

                <h3>Out of Scope</h3>
                <ul>
                    <li></li>
                </ul>

                <h2>Timeline</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Phase</th>
                            <th>Duration</th>
                            <th>Deliverables</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Phase 1</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <h2>Resources Required</h2>
                <ul>
                    <li><strong>Team:</strong></li>
                    <li><strong>Budget:</strong></li>
                    <li><strong>Tools:</strong></li>
                </ul>

                <h2>Success Criteria</h2>
                <ul>
                    <li></li>
                </ul>

                <h2>Risks and Mitigation</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Risk</th>
                            <th>Impact</th>
                            <th>Mitigation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            `
    },

    blogPost: {
      id: 'blogPost',
      name: 'Blog Post',
      description: 'Write and format a blog article',
      icon: 'edit',
      category: 'content',
      content: `
                <h1>Your Blog Title Here</h1>

                <p><em>A compelling introduction that hooks your readers...</em></p>

                <p>The first paragraph should introduce the main topic and why it matters to your audience.</p>

                <h2>Main Point 1</h2>
                <p>Develop your first key idea with supporting details, examples, or data.</p>

                <h2>Main Point 2</h2>
                <p>Present your second major point with relevant context.</p>

                <h2>Main Point 3</h2>
                <p>Continue building your argument or narrative.</p>

                <blockquote>
                    <p>Include relevant quotes or pull-quotes to emphasize important insights.</p>
                </blockquote>

                <h2>Conclusion</h2>
                <p>Summarize your key takeaways and provide a clear call-to-action for readers.</p>

                <hr>

                <p><strong>About the Author:</strong> Your bio goes here...</p>
            `
    },

    weeklyReport: {
      id: 'weeklyReport',
      name: 'Weekly Report',
      description: 'Track weekly progress and accomplishments',
      icon: 'document',
      category: 'productivity',
      content: `
                <h1>Weekly Report</h1>
                <p><strong>Week of:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Submitted by:</strong></p>

                <h2>Summary</h2>
                <p>Brief overview of the week's highlights...</p>

                <h2>Accomplishments</h2>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <h2>Completed Tasks</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>✓ Completed</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <h2>In Progress</h2>
                <ul>
                    <li></li>
                </ul>

                <h2>Blockers/Challenges</h2>
                <ul>
                    <li></li>
                </ul>

                <h2>Next Week's Goals</h2>
                <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                </ol>

                <h2>Notes</h2>
                <p></p>
            `
    }
  },

  /**
   * Get all available templates
   * @returns {Object[]} Array of template objects
   */
  getAll() {
    return Object.values(this.templates);
  },

  /**
   * Get templates by category
   * @param {string} category - Category name
   * @returns {Object[]} Array of templates in category
   */
  getByCategory(category) {
    return Object.values(this.templates).filter(t => t.category === category);
  },

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Object|null} Template object or null if not found
   */
  getById(id) {
    return this.templates[id] || null;
  },

  /**
   * Get all unique categories
   * @returns {string[]} Array of category names
   */
  getCategories() {
    const categories = new Set();
    Object.values(this.templates).forEach(t => categories.add(t.category));
    return Array.from(categories);
  }
};
