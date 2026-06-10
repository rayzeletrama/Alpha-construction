namespace App\Models;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model {
    use BelongsToTenant;
    protected $fillable = ['name', 'email', 'subject', 'message', 'status'];
}
